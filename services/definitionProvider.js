const vscode = require('vscode');
const SymbolKind = vscode.SymbolKind;
const SymbolInformation = vscode.SymbolInformation;
const Location = vscode.Location;

let DocumentDefinitions = new Map();

const includePattern = /^#\s*include\s*[<"](.*)[>"]/gm

const definitionPatterns = [
    {
        type: "regular",
        regex: /^[^\S\n]*(?:struct|technique|texture2D|sampler)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm,
    },
    {
        type: "regular",
        regex: /^[^\S\n]*@_([a-zA-Z][a-zA-Z0-9_]*)/gm,
    },
    {
        type: "regular",
        regex: /^[^\S\n]*#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:[^\S\n]+(?:\w.*)?)?$/gm,
    },
    {
        type: "cbuffer",
        regex: /^[^\S\n]*cbuffer\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*{((?:\s*[a-zA-Z_][a-zA-Z0-9_]*[^\S\n]+[a-zA-Z_][a-zA-Z0-9_]*.*)*)\s*}/gm,
        field: /^[^\S\n]*[a-zA-Z_][a-zA-Z0-9_]*[^\S\n]+([a-zA-Z_][a-zA-Z0-9_]*).*$/gm,
    },
    {
        type: "callable",
        regex: /^[^\S\n]*#\s*define\s+([a-zA-Z_][a-zA-Z0-9_]*)[^\S\n]*\(.*\)$/gm,
        param: /[a-zA-Z][a-zA-Z0-9_]*/gm,
    },
    {
        type: "callable",
        regex: /^[^\S\n]*\w+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^()]*)\)/gm,
        param: /(?:(?:in|out|inout)\s+)?[a-zA-Z][a-zA-Z0-9_]*\s+[a-zA-Z][a-zA-Z0-9_]*(?:\s*:[a-zA-Z0-9_]+)?/gm,
    },
];

const keyWords = new Set(['if', 'while', 'for']);

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

async function findAllDefinitionsRecursive(document, definitions, visited) {
    let uri = document.uri;
    if (visited.has(uri)) {
        return;
    }
    visited.add(uri);

    if (DocumentDefinitions.has(uri)) {
        let cache = DocumentDefinitions.get(uri);
        if (cache.version == document.version) {
            for (let def of cache.definitions) {
                definitions.push(def);
            }
            return;
        }
    }

    let text = document.getText();
    let defs = [];

    for (let item of definitionPatterns) {
        let match = null;
        while (match = item.regex.exec(text))
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
                let field = null;
                while (field = item.field.exec(match[2])) {
                    let offset = match[0].indexOf(field[0]);
                    let line = document.positionAt(match.index + offset);
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
                if (keyWords.has(match[1]))
                    continue;
                let line = document.positionAt(match.index).line;
                let range = document.lineAt(line).range;
                let params = [];
                let param = null;
                while (param = item.param.exec(match[2])) {
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

    let include = null;
    while (include = includePattern.exec(text)) {
        let path = ResolveFilePath(include[1]);
        let doc = null;
        try {
            doc = await vscode.workspace.openTextDocument(path);
        } catch (error) {
            // open document failed.
        }
        if (doc) {
            findAllDefinitionsRecursive(doc, defs, visited);
        }
    }

    for (let def of defs) {
        definitions.push(def);
    }

    let cache = {
        version : document.version,
        definitions : defs,
    };
    DocumentDefinitions.set(uri, cache);
}

function findAllDefinitions(document) {
    let definitions = [];
    let visited = new Set();
    findAllDefinitionsRecursive(document, definitions, visited)
    return definitions;
}

exports.findAllDefinitions = findAllDefinitions;

exports.definitionProvider = {
    provideDefinition : (document, position, token) => {
        return new Promise((resolve, reject) => {
                let wordRange = document.getWordRangeAtPosition(position);
                if (!wordRange) {
                    reject();
                }
 
                let results = [];
                let symbol = document.getText(wordRange);
                let definitions = findAllDefinitions(document);
                for (let definition of definitions) {
                    if (definition.name === symbol) {
                        results.push(definition.location);
                    }
                }
                resolve(results);
            }
        );
    }
}
