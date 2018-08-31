const vscode = require('vscode');
const SymbolKind = vscode.SymbolKind;
const SymbolInformation = vscode.SymbolInformation;
const Location = vscode.Location;
const Uri = vscode.Uri;

let DocumentDefinitions = new Map();

const includePattern = /^[^\S\n]*#\s*include\s*[<"](.*)[>"]/.source;

const definitionPatterns = [
    {
        type: "regular",
        regex: /^[^\S\n]*(?:struct|technique|texture2D|sampler)\s+([a-zA-Z_][a-zA-Z0-9_]*)/.source,
    },
    {
        type: "regular",
        regex: /^[^\S\n]*@(_[a-zA-Z][a-zA-Z0-9_]*)/.source,
    },
    {
        type: "regular",
        regex: /^[^\S\n]*#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)\s/.source,
    },
    {
        type: "cbuffer",
        regex: /^[^\S\n]*cbuffer\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*{/.source,
        end:   /^[^\S\n]*(?:{|}|struct|technique|texture2D|sampler|@})\W/.source,
        field: /^[^\S\n]*[a-zA-Z_][a-zA-Z0-9_]*[^\S\n]+([a-zA-Z_][a-zA-Z0-9_]*)/.source,
    },
    {
        type: "callable",
        regex: /^[^\S\n]*#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)\(([^\n()]*)\)/.source,
        param: /[a-zA-Z][a-zA-Z0-9_]*/.source,
    },
    {
        type: "callable",
        regex: /^[^\S\n]*(?!(?:return|else|do)\s)\w+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^()]*)\)/.source,
        param: /(?:(?:in|out|inout)\s+)?[a-zA-Z][a-zA-Z0-9_]*\s+[a-zA-Z][a-zA-Z0-9_]*(?:\s*:[a-zA-Z0-9_]+)?/.source,
    },
];

function ResolveFilePath(str) {
    str = str.replace(/\\/g, '/');
    if (str.indexOf(":") >= 0) {
        return str;
    }
    let config = vscode.workspace.getConfiguration('messiahsl');
    let dirs = ["EngineShaders/", "EngineShaders/Include/", "Shaders/", "Shaders/Include/"];
    let fs = require('fs');
    for (let index = 0; index < dirs.length; index++) {
        const element = dirs[index];
        let path = config.enginePath + "/Engine/" + element + str;
        if (fs.existsSync(path)) {
            return path;
        }
    }
    return str;
}

async function findDocumentByUri(uri) {
    for (let doc of vscode.workspace.textDocuments) {
        if (doc.uri == uri) {
            return doc;
        }
    }
    try {
        let doc = await vscode.workspace.openTextDocument(uri);
        return doc;
    } catch (error) {
        // open document failed.
    }
    return null;
}

async function findAllDefinitionsRecursive(document, definitions, visited) {
    let uri = document.uri;
    if (visited.has(uri)) {
        return;
    }
    visited.add(uri);

    // If already cached.
    if (DocumentDefinitions.has(uri)) {
        let cache = DocumentDefinitions.get(uri);
        if (cache.version == document.version) {
            for (let def of cache.definitions) {
                definitions.push(def);
            }
            for (let header of cache.includes) {
                let doc = await findDocumentByUri(header);
                if (doc) {
                    findAllDefinitionsRecursive(doc, definitions, visited);
                }           
            }
            return;
        }
    }

    let text = document.getText();
    let defs = [];

    // Find definitions in current document.
    for (let item of definitionPatterns) {
        let match = null;
        let regex = new RegExp(item.regex, "gm");
        while (match = regex.exec(text))
        {
            if (item.type == "regular") {
                let line = document.positionAt(match.index).line;
                let range = document.lineAt(line).range;
                let def = {
                    type : "regular",
                    name : match[1],
                    location : new Location(document.uri, range),
                };
                defs.push(def);
            }
            else if (item.type == "cbuffer") {
                let endRegex = new RegExp(item.end, "gm");
                let startIndex = match.index + match[0].length;
                endRegex.lastIndex = startIndex;
                let end = endRegex.exec(text);
                let content = "";
                if (end) {
                    content = text.substring(startIndex, end.index);
                }

                let fieldRegex = new RegExp(item.field, "gm");
                let field = null;
                while (field = fieldRegex.exec(content)) {
                    let line = document.positionAt(startIndex + field.index);
                    let range = document.lineAt(line).range;
                    let def = {
                        type : "cbuffer",
                        name : field[1],
                        location : new Location(document.uri, range),
                    };
                    defs.push(def);
                }
            }
            else if (item.type == "callable") {
                let line = document.positionAt(match.index).line;
                let range = document.lineAt(line).range;
                let params = [];
                let paramRegex = new RegExp(item.param, "gm");
                let param = null;
                while (param = paramRegex.exec(match[2])) {
                    params.push(param[0]);
                }
                let def = {
                    type : "callable",
                    name : match[1],
                    params : params,
                    location : new Location(document.uri, range),
                };
                defs.push(def);
            }
        }
    }
    for (let def of defs) {
        definitions.push(def);
    }

    // Process header files.
    let includeRegex = new RegExp(includePattern, "gm");
    let includes = [];
    let include = null;
    while (include = includeRegex.exec(text)) {
        let path = ResolveFilePath(include[1]);
        let doc = await findDocumentByUri(Uri.file(path));
        if (doc) {
            findAllDefinitionsRecursive(doc, definitions, visited);
            includes.push(doc.uri);
        }
    }

    let cache = {
        version : document.version,
        definitions : defs,
        includes : includes,
    };
    DocumentDefinitions.set(uri, cache);
}

async function findAllDefinitions(document) {
    let definitions = [];
    let visited = new Set();
    await findAllDefinitionsRecursive(document, definitions, visited)
    return definitions;
}

exports.findAllDefinitions = findAllDefinitions;

exports.definitionProvider = {
    provideDefinition : (document, position, token) => {
        return new Promise((resolve, reject) => {
                let wordRange = document.getWordRangeAtPosition(position);
                if (!wordRange) {
                    reject();
                    return;
                }
 
                let symbol = document.getText(wordRange); 
                findAllDefinitions(document).then(
                    (definitions) => {
                        let results = [];
                        for (let definition of definitions) {
                            if (definition.name === symbol) {
                                results.push(definition.location);
                            }
                        }
                        resolve(results);
                    }
                ).catch(
                    (error) => {
                        reject();
                    }
                );
            }
        );
    }
}
