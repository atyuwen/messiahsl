const vscode = require('vscode');
const CompletionItem = vscode.CompletionItem;
const CompletionItemKind = vscode.CompletionItemKind;
const findAllDefinitions = require('./definitionProvider').findAllDefinitions;
const intrinsics = require('./intrinsics');

function matches(str, prefix) {
    return str.length >= prefix.length && str.substr(0, prefix.length).toLowerCase() == prefix;
};

async function getCompletionProposals(document, position) {
    let proposals = [];
    let range = document.getWordRangeAtPosition(position);
    if (!range) {
        return proposals;
    }

    let prefix = document.getText(range).toLowerCase();
    let start = document.offsetAt(range.start);
    if (start > 0) {
        let char = document.getText()[start - 1];
        if (char == '.' || char == '@') {
            prefix = char + prefix;
        }   
    }

    for (let entry in intrinsics.intrinsicfunctions) {
        if (matches(entry, prefix)) {
            proposals.push(new CompletionItem(entry, CompletionItemKind.Interface));
        }
    }

    for (let entry of intrinsics.intrinsicSemantics) {
        if (matches(entry, prefix)) {
            proposals.push(new CompletionItem(entry, CompletionItemKind.EnumMember));
        }
    }

    for (let entry of intrinsics.intrinsicProperties) {
        if (matches(entry, prefix)) {
            proposals.push(new CompletionItem(entry, CompletionItemKind.Constant));
        }
    }

    let definitions = await findAllDefinitions(document);
    for (let def of definitions) {
        if (matches(def.name, prefix)) {
            let kind = CompletionItemKind.Reference;
            if (def.type == "callable") {
                kind = CompletionItemKind.Function;
            } else if (def.type == "cbuffer") {
                kind = CompletionItemKind.Field;
            } else if (prefix[0] == '@') {
                kind = CompletionItemKind.Property;
            }
            proposals.push(new CompletionItem(def.name, kind));
        }
    }

    for (let proposal of proposals) {
        let char = proposal.label[0];
        if (char == '.' || char == '@') {
            proposal.label = proposal.label.substr(1);
        }
    }
    return proposals;
}

exports.completionProvider = {
    provideCompletionItems : (document, position, token) => {
        return new Promise((resolve, reject) => {
                getCompletionProposals(document, position).then(
                    (proposals) => {
                        resolve(proposals);
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
