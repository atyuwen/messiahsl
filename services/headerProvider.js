const vscode = require('vscode');
const definitionProvider = require('./definitionProvider');
const findAllDefinitions = definitionProvider.findAllDefinitions;
const documentDefinitions = definitionProvider.documentDefinitions;

function findAllHeadersRecursive(uri, headers) {
    let cache = documentDefinitions.get(uri);
    for (let header of cache.includes) {
        if (!headers.has(header)) {
            headers.add(header);
            findAllHeadersRecursive(header, headers);
        }
    }
}

async function findAllHeaders(document) {
    await findAllDefinitions(document);
    let headers = new Set();
    findAllHeadersRecursive(document.uri, headers);
    return headers;
}

exports.findAllHeaders = findAllHeaders; 
