// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

function ResolveFilePath(str) {
    if (str.indexOf(":") >= 0) {
        str = str.substr(str.lastIndexOf("\\\\") + 2);
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

function ShowDiagnostics(error) {
    let pat = /(.*)\(([0-9]+),([0-9]+)\):\s(.*)/i;
    let ret = pat.exec(error)
    if (ret == null) {
        return false;
    }
    let row = parseInt(ret[2]) - 1;
    let col = parseInt(ret[3]) - 1;
    let doc = vscode.window.activeTextEditor.document;
    let colleciton = vscode.languages.createDiagnosticCollection(doc.fileName);
    let diag = [new vscode.Diagnostic(new vscode.Range(row, col, row, col + 1000), ret[4])];
    let uri = vscode.Uri.file(ResolveFilePath(ret[1]));
    let d = colleciton.set(uri, diag);
    return true;
}

function ShaderLint(context) {
    let doc = vscode.window.activeTextEditor.document;
    let colleciton = vscode.languages.createDiagnosticCollection(doc.fileName);
    colleciton.clear();

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
    const { exec } = require('child_process');
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        if (!ShowDiagnostics(stdout)) {
            let out = vscode.window.createOutputChannel("MessiahSL");
            out.appendLine(stdout);
            out.show(true);
        }
        vscode.window.showErrorMessage("Compiled failed.");
      }
      else {
        vscode.window.showInformationMessage("Compiled successful.");
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
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}

exports.deactivate = deactivate;
