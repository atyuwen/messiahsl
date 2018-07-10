# MessiahSL

Messiah shader language extension for Visual Studio Code.

## Features

Provide syntax checking for Messiah shader language. Three different lint modes are provided:

* `Lint [Ctrl+F7]`: Lint current shader (default), very fast but only a subset of shader branches are checked.
* `Lint Full (Fast) [Shift+Ctrl+F7]`: Run a fast lint, try to check all shader branches, but might introduce unexpected syntax errors.
* `Lint Full (Slow)`: Run a full lint. All shader branches will be checked. It might take a very long time.

## Requirements

Make sure you have Messiah Engine installed.

## Extension Settings

This extension contributes the following settings:

* `messiahsl.enginePath`: Specify the engine path.
* `messiahsl.runOnSave`: Enable/disable auto checking when file is saved.
* `messiahsl.suppressWarning`: Specify which warnings should be suppressed.
* `messiahsl.autoRefresh`: Auto refresh shader source when compiled.

## Release Notes

### 0.6.0

Added three different lint modes.

### 0.4.0

All compile warnings wil be reported. Set 'messiahsl.suppressWarning' to suppress certain warnings.

### 0.2.0

Initial beta release.
