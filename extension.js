// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const documentSymbolProvider = require('./services/symbolProvider').documentSymbolProvider;
const definitionProvider = require('./services/definitionProvider').definitionProvider;
const documentDefinitions = require('./services/definitionProvider').documentDefinitions;
const signatureProvider = require('./services/signatureProvider').signatureProvider;
const completionProvider = require('./services/completionProvider').completionProvider;
const findAllHeaders = require('./services/headerProvider').findAllHeaders;

// Global definitions;
let outputChannel = null;
let diagnosticCollection = null;
let statusBarItem = null;

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

function ShowDiagnostics(error, suppressWarning) {
    let patM = /(.*)\(([0-9]+),([0-9]+)\):\s(error|warning):(.*)/ig;
    let patS = /(.*)\(([0-9]+),([0-9]+)\):\s(error|warning):(.*)/i;
    let ret = patM.exec(error)
    if (ret == null) {
        return false;
    }

    let matchSet = new Set();
    while(ret != null)
    {
        matchSet.add(ret[0]);
        ret = patM.exec(error);
    }
    let matchArray = Array.from(matchSet);

    let colleciton = diagnosticCollection;
    let suppressedWarnings = suppressWarning == null ? [] : suppressWarning.split(", ");

    let errFounded = false;
    for (let i = 0; i < matchArray.length; i++) {
        const str = matchArray[i];
        let match = patS.exec(str);
        let message = match[5].trim();
        let servity = match[4] == "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;

        let suppressed = false;
        if (servity == vscode.DiagnosticSeverity.Warning) {
            for (let j = 0; j < suppressedWarnings.length; j++) {
                const w = suppressedWarnings[j];
                if (w != "" && (w == "*" || message.indexOf(w) >= 0)) {
                    suppressed = true;
                    break;
                }
            }
        }
        if (suppressed) {
            continue;
        }

        let row = parseInt(match[2]) - 1;
        let col = parseInt(match[3]) - 1;
        let diag = [new vscode.Diagnostic(new vscode.Range(row, col, row, col + 1000), message, servity)];
        let uri = vscode.Uri.file(ResolveFilePath(match[1]));
 
        if (colleciton.has(uri)) {
            diag = colleciton.get(uri).concat(diag);
        }
        colleciton.set(uri, diag);

        if (servity == vscode.DiagnosticSeverity.Error) {
            errFounded = true;
        }
    }
    return errFounded;
}

function GenerateWebviewContent(properties) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
            set shader properties here?
        </body>
    </html>`;
}

function ShowWebview(shader, out) {
    const panel = vscode.window.createWebviewPanel('Properties', "[" + shader + "]", vscode.ViewColumn.Two, {});
    panel.webview.html = GenerateWebviewContent();
}

function ShaderLint(doc, full, fast) {
    diagnosticCollection.clear();
    outputChannel.clear();

    let config = vscode.workspace.getConfiguration('messiahsl');
    if (config.enginePath == null) {
        vscode.window.showErrorMessage("Please set 'enginePath' in configuration.");
        statusBarItem.text = "";
        statusBarItem.hide();
        return;
    }

    let linter = config.enginePath + '/Engine/Binaries/Win64/ShaderLint_x64h.exe';
    let fs = require('fs');
    if (!fs.existsSync(linter)) {
        vscode.window.showErrorMessage("Cannot locate ShaderLint_x64h.exe in specified engine path.");
        statusBarItem.text = "";
        statusBarItem.hide();
        return;
    } 

    let parts = doc.fileName.split(".");
    let shader = parts[0].replace(/\\/g, '/');
    shader = shader.substr(shader.indexOf("Shaders/") + 8);

    let cmd = linter + " --shader=" + shader;
    if (config.autoRefresh) {
        cmd = cmd + " --refresh=1";
    }
    if (fast) {
        cmd = cmd + " --fast=1";
    }
    if (full) {
        cmd = cmd + " --full=1";
    }

    const { exec } = require('child_process');
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        if (!ShowDiagnostics(stderr, config.suppressWarning)) {
            let error = "An internal error has occurred in Messiah shader compiler.";
            if (stdout == "") {
                error = error + "\n" + stdout; 
            }
            outputChannel.appendLine(error);
            outputChannel.show(true);
        }
        vscode.window.showErrorMessage("<" + shader + "> Compiled failed.");
      }
      else {
        ShowDiagnostics(stderr, config.suppressWarning);
        vscode.window.showInformationMessage("<" + shader + "> Compiled successfully.");
        outputChannel.append(stdout);
        //outputChannel.show(false);
        //ShowWebview(shader, stdout);
      }
      statusBarItem.text = "";
      statusBarItem.hide();
    });
}

async function GetOpenedDocuments() {
    let docs = [];
    let doc = vscode.window.activeTextEditor.document;
    docs.push(doc);
    while (true) {
        await vscode.commands.executeCommand("workbench.action.nextEditor");
        let next = vscode.window.activeTextEditor.document;
        if (!next || next == doc) {
            break;
        }
        docs.push(next);
    }
    return docs;
}

async function ShaderLintHeader(doc, full, fast) {
    let docs = await GetOpenedDocuments();
    for (let document of docs) {
        let ext = document.fileName.split('.').pop();
        if (ext.toLowerCase() == "fx") {
            let headers = await findAllHeaders(document);
            if (headers.has(doc.uri)) {
                ShaderLint(document, full, fast);
            }
        }
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    outputChannel = vscode.window.createOutputChannel("MessiahSL");
    diagnosticCollection = vscode.languages.createDiagnosticCollection("MessiahSL");
    statusBarItem = vscode.window.createStatusBarItem();
    statusBarItem.text = "";

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let cmd0 = vscode.commands.registerCommand('extension.ShaderLint', async function () {
        // The code you place here will be executed every time your command is executed
        statusBarItem.text = "$(sync~spin) Running a simple lint... ";
        statusBarItem.show();
        let doc = vscode.window.activeTextEditor.document;
        await doc.save();
        ShaderLint(doc, false, false);
    });
    let cmd1 = vscode.commands.registerCommand('extension.ShaderLintFast', async function () {
        // The code you place here will be executed every time your command is executed
        statusBarItem.text = "$(sync~spin) Running a fast lint... ";
        statusBarItem.show();
        let doc = vscode.window.activeTextEditor.document;
        await doc.save();
        ShaderLint(doc, true, true);
    });
    let cmd2 = vscode.commands.registerCommand('extension.ShaderLintFull', async function () {
        // The code you place here will be executed every time your command is executed
        statusBarItem.text = "$(sync~spin) A full lint might take a very long time, please wait... ";
        statusBarItem.show();
        let doc = vscode.window.activeTextEditor.document;
        await doc.save();
        ShaderLint(doc, true, false);
    });

    context.subscriptions.push(cmd0);
    context.subscriptions.push(cmd1);
    context.subscriptions.push(cmd2);

    let config = vscode.workspace.getConfiguration('messiahsl');
    if (config.runOnSave != "Disabled") {
        let onsave = vscode.workspace.onDidSaveTextDocument((doc => {
                let ext = doc.fileName.split('.').pop();
                if (ext.toLowerCase() == 'fx' && statusBarItem.text == "") {
                    if (config.runOnSave == "Lint") {
                        ShaderLint(doc, false, false);
                    } else if (config.runOnSave == "LintFast") {
                        ShaderLint(doc, true, true);
                    } else if (config.runOnSave == "LintFull") {
                        ShaderLint(doc, true, false);
                    }
                } else if (ext.toLowerCase() == 'fxh' && config.autoLintHeader) {
                    if (config.runOnSave == "Lint") {
                        ShaderLintHeader(doc, false, false);
                    } else if (config.runOnSave == "LintFast") {
                        ShaderLintHeader(doc, true, true);
                    } else if (config.runOnSave == "LintFull") {
                        ShaderLintHeader(doc, true, false);
                    }
                }
            }
        ));
        context.subscriptions.push(onsave);
    }

    // Register services
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider("hlsl", documentSymbolProvider));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider("hlsl", definitionProvider));
    context.subscriptions.push(vscode.languages.registerSignatureHelpProvider("hlsl", signatureProvider, '(', ',', ' '));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("hlsl", completionProvider, '.'));

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('MessiahSL is activated.');
    outputChannel.appendLine("MessiahSL is activated.");
    outputChannel.show(true);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;
