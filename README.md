# MessiahSL

Messiah shader language extension for Visual Studio Code.

## Features

Provides syntax checking for Messiah shader language. Three different lint modes are provided:

* `Lint` [`F7`] : Lint current shader (default), very fast but only a subset of shader branches are checked.
* `Lint Full (Fast)` [`Ctrl`+`F7`] : Run a fast lint, try to check all shader branches, but might introduce unexpected syntax errors.
* `Lint Full (Slow)` [`Ctrl`+`Shift`+`F7`] : Run a full lint. All shader branches will be checked. It might take a very long time.

Provides syntax highlighting and code snippets, as well as some language services including:

* `Go to definition` :  You can go to the definition of a symbol by pressing `F12`.
* `Go to symbol in file` : You can navigate symbols inside current file.
* Better auto-completion.
* Auto prompt for function and method parameters.

## Requirements

Make sure you have Messiah Engine installed.
