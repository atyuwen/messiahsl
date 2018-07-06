// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Global definitions
var outChannel = null;

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
    let patM = /(.*)\(([0-9]+),([0-9]+)\):\s(error|warning)(.*)/ig;
    let patS = /(.*)\(([0-9]+),([0-9]+)\):\s(error|warning)(.*)/i;
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

    let doc = vscode.window.activeTextEditor.document;
    let colleciton = vscode.languages.createDiagnosticCollection(doc.fileName);
    let suppressedWarnings = suppressWarning == null ? [] : suppressWarning.split(", ");

    for (let i = 0; i < matchArray.length; i++) {
        const str = matchArray[i];
        let match = patS.exec(str);
        let message = match[5];
        var servity = match[4] == "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;

        var suppressed = false;
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
        let diag = [new vscode.Diagnostic(new vscode.Range(row, col, row, col + 1000), match[5], servity)];
        let uri = vscode.Uri.file(ResolveFilePath(match[1]));
 
        if (colleciton.has(uri)) {
            diag = colleciton.get(uri).concat(diag);
        }
        colleciton.set(uri, diag);
    }
    return true;
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

function ShaderLint(context) {
    let doc = vscode.window.activeTextEditor.document;
    let colleciton = vscode.languages.createDiagnosticCollection(doc.fileName);
    colleciton.clear();
    outChannel.clear();

    let config = vscode.workspace.getConfiguration('messiahsl');
    if (config.enginePath == null) {
        vscode.window.showErrorMessage("Please set 'enginePath' in configuration.");
        return;
    }
    
    let linter = config.enginePath + '/Engine/Binaries/Win64/ShaderLint_x64h.exe';
    let fs = require('fs');
    if (!fs.existsSync(linter)) {
        vscode.window.showErrorMessage("Cannot locate ShaderLint_x64h.exe in specified engine path.");
        return;
    }

    let parts = doc.fileName.split(".");
    let shader = parts[0].replace(/\\/g, '/');
    shader = shader.substr(shader.indexOf("Shaders/") + 8);

    let cmd = linter + " --shader=" + shader;
    if (config.autoRefresh) {
        cmd = cmd + " --refresh=1";
    }

    const { exec } = require('child_process');
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        if (!ShowDiagnostics(stdout, config.suppressWarning)) {
            let error = stdout;
            if (error == "") {
                error = "An internal error has occurred in Messiah shader compiler."
            }
            outChannel.appendLine(error);
            outChannel.show(true);
        }
        vscode.window.showErrorMessage("<" + shader + "> Compiled failed.");
      }
      else {
        ShowDiagnostics(stdout, config.suppressWarning);
        vscode.window.showInformationMessage("<" + shader + "> Compiled successful.");
        //ShowWebview(shader, stdout);
      }
    });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.ShaderLint', function () {
        // The code you place here will be executed every time your command is executed
        ShaderLint(context);
    });
    context.subscriptions.push(disposable);

    let config = vscode.workspace.getConfiguration('messiahsl');
    if (config.runOnSave) {
        let onsave = vscode.workspace.onDidSaveTextDocument((event =>
            ShaderLint(context)
        ));
        context.subscriptions.push(onsave);
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('MessiahSL is activated.');
    outChannel = vscode.window.createOutputChannel("MessiahSL");
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;
