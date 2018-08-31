const vscode = require('vscode');
const SignatureHelp = vscode.SignatureHelp;
const SignatureInformation = vscode.SignatureInformation;
const ParameterInformation = vscode.ParameterInformation;
const findAllDefinitions = require('./definitionProvider').findAllDefinitions;

function reverseString(str) {
    return str.split('').reverse().join('');
};

const callPattern = /\s*((?:,\s*\w+\s*)*)\(\s*(\w+)\s*/;

async function generateSignatureHelp(document, position) {
    let end = document.offsetAt(position);
    let start = Math.max(end - 200, 0);
    let str = document.getText().substring(start, end);
    let reverse = reverseString(str);
    let match = callPattern.exec(reverse);
    if (!match || match.index != 0) {
        return null;
    }

    let func = reverseString(match[2]);
    let index = 0;
    for (let c of match[1]) {
        if (c == ',') {
            index += 1;
        }
    }

    let definitions = await findAllDefinitions(document);
    let callable = null;
    for (let def of definitions) {
        if (def.type == "callable" && def.name == func) {
            callable = def;
            break;
        }
    }

    if (!callable || callable.params.length <= index) {
        return null;
    }

    let signature = callable.name + '(';
    let parameters = [];
    for (let i = 0; i < callable.params.length; ++i) {
        let param = callable.params[i];
        parameters.push(new ParameterInformation(param));
        if (i < callable.params.length - 1) {
            signature += param + ', ';
        } else {
            signature += param;
        }
    }
    signature += ')';
    let info = new SignatureInformation(signature);
    info.parameters = parameters;

    let help = new SignatureHelp();
    help.signatures.push(info);
    help.activeSignature = 0;
    help.activeParameter = index;
    return help;
}

exports.signatureProvider = {
    provideSignatureHelp : (document, position, token) => {
        return new Promise((resolve, reject) => {
                generateSignatureHelp(document, position).then(
                    (help) => {
                        if (help) {
                            resolve(help);
                        } else {
                            reject();
                        }
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
