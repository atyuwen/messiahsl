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

    let word = document.getText(range);
    let prefix = word.toLowerCase();
    let start = document.offsetAt(range.start);
    if (start > 0) {
        let char = document.getText()[start - 1];
        if (char == '.' || char == '@') {
            prefix = char + prefix;
        }
    }

    let proposalSet = new Set();
    let addCompletionItem = (label, kind) => {
        let char = label[0];
        if (char == '.' || char == '@') {
            label = label.substr(1);
        }
        if (!proposalSet.has(label)) {
            proposals.push(new CompletionItem(label, kind));
            proposalSet.add(label);
        }
    }

    for (let entry in intrinsics.intrinsicfunctions) {
        if (matches(entry, prefix)) {
            addCompletionItem(entry, CompletionItemKind.Interface);
        }
    }

    for (let entry of intrinsics.intrinsicSemantics) {
        if (matches(entry, prefix)) {
            addCompletionItem(entry, CompletionItemKind.EnumMember);
        }
    }

    for (let entry of intrinsics.intrinsicProperties) {
        if (matches(entry, prefix)) {
            addCompletionItem(entry, CompletionItemKind.Constant);
        }
    }

    for (let entry of intrinsics.keywords) {
        if (matches(entry, prefix)) {
            addCompletionItem(entry, CompletionItemKind.Keyword);
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
            addCompletionItem(def.name, kind);
        }
    }

    let text = document.getText();
    let wordPattern = "\\b" + word + "\\w+\\b";
    let wordRegex = new RegExp(wordPattern, "ig");
    let match = null;
    while (match = wordRegex.exec(text)) {
        addCompletionItem(match[0], CompletionItemKind.Text);
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
