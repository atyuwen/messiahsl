const vscode = require('vscode');
const SymbolKind = vscode.SymbolKind;
const SymbolInformation = vscode.SymbolInformation;
const Location = vscode.Location;

const symbolPatterns = [
    { kind: SymbolKind.Function,    pattern: /^[^\S\n]*(?!(?:return|else|do)\s)\w+\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/.source },
    { kind: SymbolKind.Struct,      pattern: /^[^\S\n]*(?:struct|cbuffer)\s+([a-zA-Z_][a-zA-Z0-9_]*)/.source },
    { kind: SymbolKind.Interface,   pattern: /^[^\S\n]*(?:technique)\s+([a-zA-Z_][a-zA-Z0-9_]*)/.source },
];

function findAllSymbols(document) {
    let text = document.getText();
    let symbols = [];
    for (let item of symbolPatterns) {
        let kind = item.kind;
        let pattern = new RegExp(item.pattern, "gm");
        let match = null;
        while (match = pattern.exec(text))
        {
            let symbol = match[1];
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
