const vscode = require('vscode');
const SignatureHelp = vscode.SignatureHelp;
const SignatureInformation = vscode.SignatureInformation;
const ParameterInformation = vscode.ParameterInformation;
const MarkDownString = vscode.MarkdownString;
const findAllDefinitions = require('./definitionProvider').findAllDefinitions;
const intrinsicfunctions = require('./intrinsics').intrinsicfunctions;

function reverseString(str) {
    return str.split('').reverse().join('');
};

const callPattern = /\s*((?:,\s*\w+\s*)*)\(\s*(\w+\.?)\s*/;

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

    let isIntrinsic = false;
    let callable = intrinsicfunctions[func];
    if (callable) {
        isIntrinsic = true;
    } else {
        let definitions = await findAllDefinitions(document);
        for (let def of definitions) {
            if (def.type == "callable" && def.name == func) {
                callable = def;
                break;
            }
        }
    }

    if (!callable || callable.params.length <= index) {
        return null;
    }

    let signature = func + '(';
    if (signature[0] == '.') {
        signature = "[object]" + signature;
    }
    let parameters = []; 
    for (let i = 0; i < callable.params.length; ++i) {
        let param = callable.params[i];
        let paramInfo = null;
        if (isIntrinsic) {
            paramInfo = new ParameterInformation(param.label, param.doc);
        } else {
            paramInfo = new ParameterInformation(param);
        }
        parameters.push(paramInfo);
        if (i < callable.params.length - 1) {
            signature += paramInfo.label + ', ';
        } else {
            signature += paramInfo.label;
        }
    }
    signature += ')';
    let info = new SignatureInformation(signature);
    info.parameters = parameters;
    if (isIntrinsic) {
        info.documentation = new MarkDownString("`intrinsic`" + callable.desc);
    }

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
