const vscode = require('vscode');
const SymbolKind = vscode.SymbolKind;
const SymbolInformation = vscode.SymbolInformation;
const Location = vscode.Location;

const symbolPatterns = [
    { kind: SymbolKind.Function,    pattern: /^[^\S\n]*\w+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/gm },
    { kind: SymbolKind.Struct,      pattern: /^[^\S\n]*(?:struct|cbuffer)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm },
    { kind: SymbolKind.Interface,   pattern: /^[^\S\n]*(?:technique)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm },
];

const keyWords = new Set(['if', 'while', 'for']);

function findAllSymbols(document) {
    let text = document.getText();
    let symbols = [];
    for (let item of symbolPatterns) {
        let kind = item.kind;
        let pattern = item.pattern;
        let match = null;
        while (match = pattern.exec(text))
        {
            let symbol = match[1];
            if (keyWords.has(symbol))
                continue;

            let line = document.positionAt(match.index).line;
            let range = document.lineAt(line).range;
            symbols.push(new SymbolInformation(symbol, kind, '', new Location(document.uri, range)));
        }
    }
    return symbols;
}

exports.documentSymbolProvider = {
    provideDocumentSymbols : (document, token) => {
        return new Promise((resolve, reject) => {
                let symbols = findAllSymbols(document);
                resolve(symbols);
            }
        );
    }
}
