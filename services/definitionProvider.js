const vscode = require('vscode');
const SymbolKind = vscode.SymbolKind;
const SymbolInformation = vscode.SymbolInformation;
const Location = vscode.Location;

const symbolPatterns = [
    { kind: SymbolKind.Function,    pattern: /^\w+\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)\s*\(/gm },
    { kind: SymbolKind.Struct,      pattern: /^(?:struct|cbuffer)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/gm },
    { kind: SymbolKind.Interface,   pattern: /^(?:technique)\s+([a-zA-Z_\x7f-\xff][a-zA-Z0-9:_\x7f-\xff]*)/gm },
];

function findAllDefinitions(document) {
    let text = document.getText();
    let symbols = [];
    for (let item of symbolPatterns) {
        let kind = item.kind;
        let pattern = item.pattern;
        let match = null;
        while (match = pattern.exec(text))
        {
            let line = document.positionAt(match.index).line;
            let range = document.lineAt(line).range;
            let symbol = match[1];
            symbols.push(new SymbolInformation(symbol, kind, '', new Location(document.uri, range)));
        }
    }
    return symbols;
}

exports.documentSymbolProvider = {
    provideDocumentSymbols : (document, token) => {
        return new Promise((resolve, reject) => {
                let symbols = findAllDefinitions(document);
                resolve(symbols);
            }
        );
    }
}
