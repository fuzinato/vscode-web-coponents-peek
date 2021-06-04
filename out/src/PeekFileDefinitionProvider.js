"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class PeekFileDefinitionProvider {
    constructor(targetFileExtensions = []) {
        this.targetFileExtensions = [];
        console.log(targetFileExtensions);
        this.targetFileExtensions = targetFileExtensions;
    }
    getComponentName(position) {
        const doc = vscode.window.activeTextEditor.document;
        const selection = doc.getWordRangeAtPosition(position);
        const selectedText = doc.getText(selection);
        let possibleFileNames = [];
        this.targetFileExtensions.forEach((ext) => {
            possibleFileNames.push(selectedText + ext);
        });
        console.log('possibleFileNames', possibleFileNames);
        return possibleFileNames;
    }
    searchFilePath(fileName) {
        return vscode.workspace.findFiles(`**/${fileName}`); // Returns promise
    }
    provideDefinition(document, position, token) {
        let filePaths = [];
        const componentNames = this.getComponentName(position);
        const searchPathActions = componentNames.map(this.searchFilePath);
        const searchPromises = Promise.all(searchPathActions); // pass array of promises
        return searchPromises.then((paths) => {
            filePaths = [].concat.apply([], paths);
            if (filePaths.length) {
                let allPaths = [];
                filePaths.forEach((filePath) => {
                    allPaths.push(new vscode.Location(vscode.Uri.file(`${filePath.path}`), new vscode.Position(0, 1)));
                });
                return allPaths;
            }
            else {
                return undefined;
            }
        }, (reason) => {
            return undefined;
        });
    }
}
exports.default = PeekFileDefinitionProvider;
//# sourceMappingURL=PeekFileDefinitionProvider.js.map