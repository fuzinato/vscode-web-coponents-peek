'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const PeekFileDefinitionProvider_1 = require("./PeekFileDefinitionProvider");
const languageConfiguration = {
    wordPattern: /(\w+((-\w+)+)?)/,
};
function activate(context) {
    const supportedLanguages = ['javascript', 'typescript'];
    const targetFileExtensions = ['.js', '.ts'];
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(supportedLanguages, new PeekFileDefinitionProvider_1.default(targetFileExtensions)));
    /* Provides way to get selected text even if there is dash
     * ( must have fot retrieving component name )
     */
    supportedLanguages.forEach((lang) => {
        context.subscriptions.push(vscode.languages.setLanguageConfiguration(lang, languageConfiguration));
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map