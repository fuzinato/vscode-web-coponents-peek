import * as vscode from 'vscode';
import { regexpMethod } from './extension';
export default class PeekFileDefinitionProvider
  implements vscode.DefinitionProvider
{
  targetFileExtensions: string[] = [];

  constructor(targetFileExtensions: string[] = []) {
    console.log(targetFileExtensions);
    this.targetFileExtensions = targetFileExtensions;
  }

  getMethodName(position: vscode.Position): String[] {
    const doc = vscode.window.activeTextEditor?.document;

    if (!doc) {
      return [];
    }

    const selection = doc.getWordRangeAtPosition(position);
    const selectedText = doc.getText(selection);

    if (!selectedText) {
      return [];
    }

    const match: any = selectedText.match(regexpMethod);
    const methodName = match[3];
    console.log(methodName);
    // selectedText.match(/\w+/g)?.forEach((str) => {
    //   return (altName += str[0].toUpperCase() + str.substring(1));
    // });

    // if (altName) {
    //   possibleFileNames.push(altName);
    // }
    return methodName;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`); // Returns promise
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | vscode.Location[] | any> {
    console.log(document);
    let filePaths = [];
    const methodName = this.getMethodName(position);
    const searchPathActions = methodName.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises

    return searchPromises.then(
      (paths) => {
        filePaths = [].concat.apply([], paths as any[]);

        if (filePaths.length) {
          let allPaths: Array<vscode.Location> = [];
          filePaths.forEach((filePath: any) => {
            allPaths.push(
              new vscode.Location(
                vscode.Uri.file(`${filePath.path}`),
                new vscode.Position(0, 1)
              )
            );
          });
          return allPaths;
        } else {
          return undefined;
        }
      },
      (reason) => {
        return undefined;
      }
    );
  }
}
