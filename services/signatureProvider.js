const vscode = require('vscode');
const SignatureHelp = vscode.SignatureHelp;
const SignatureInformation = vscode.SignatureInformation;
const ParameterInformation = vscode.ParameterInformation;
const MarkDownString = vscode.MarkdownString;
const findAllDefinitions = require('./definitionProvider').findAllDefinitions;
const intrinsicfunctions = require('./intrinsics').intrinsicfunctions;

function reverseString(str) {
    return str.split('').reverse().join('');
}

const funcPattern = /\s*(\w+\.?)/;

function extractFunctionCall(str) {
    let reverse = reverseString(str);
    let index = 0;
    let depth = 0;
    for (let i = 0; i < reverse.length; ++i) {
        let c = reverse[i];
        if (c == '(') {
            if (depth == 0) {
                let suffix = reverse.substring(i + 1);
                let match = funcPattern.exec(suffix);
                if (!match || match.index != 0) {
                    return null;
                }
                let func = reverseString(match[1]);
                return [func, index];
            } else {
                depth -= 1;
            }
        } else if (c == ')') {
            depth += 1;
        } else if (c == ',') {
            if (depth == 0) {
                index += 1;
            }
        }
    }
    return null;
}

async function generateSignatureHelp(document, position) {
    let end = document.offsetAt(position);
    let start = Math.max(end - 200, 0);
    let str = document.getText().substring(start, end);
    let call = extractFunctionCall(str);
    if (call == null)
        return null;

    let [func, index] = call;
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
            let docString = new MarkDownString("`arg" + i + "`" + param.doc);
            paramInfo = new ParameterInformation(param.label, docString);
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
        info.documentation = new MarkDownString("`desc`" + callable.desc);
    } else {
        info.documentation = new MarkDownString("`desc` User defined function or macro.");
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
