import * as vscode from 'vscode';
import PeekFileDefinitionProvider from './PeekFileDefinitionProvider';
export const regexpMethod:RegExp =  /([@|on]\w+|click)="?\$?{?(this\.)?(\w+)/;
const languageConfiguration: vscode.LanguageConfiguration = {
  wordPattern: regexpMethod,
  // wordPattern: /(\w+((-\w+)+)?)/,
};

export function activate(context: vscode.ExtensionContext) {
  const supportedLanguages = ['javascript', 'typescript'];
  const targetFileExtensions = ['.js', '.ts', '.tsx', 'jsx'];

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      supportedLanguages,
      new PeekFileDefinitionProvider(targetFileExtensions)
    )
  );

  /* Provides way to get selected text even if there is dash
   * ( must have fot retrieving component name )
   */
  supportedLanguages.forEach((lang) => {
    context.subscriptions.push(
      vscode.languages.setLanguageConfiguration(lang, languageConfiguration)
    );
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
