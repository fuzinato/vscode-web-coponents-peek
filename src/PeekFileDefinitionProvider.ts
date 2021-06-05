import * as vscode from 'vscode';

export default class PeekFileDefinitionProvider
  implements vscode.DefinitionProvider
{
  targetFileExtensions: string[] = [];

  constructor(targetFileExtensions: string[] = []) {
    console.log(targetFileExtensions);
    this.targetFileExtensions = targetFileExtensions;
  }

  getComponentName(position: vscode.Position): String[] {
    const doc = vscode.window.activeTextEditor?.document;

    if (!doc) {
      return [];
    }

    const selection = doc.getWordRangeAtPosition(position);
    const selectedText = doc.getText(selection);
    if (!selectedText) {
      return [];
    }

    let possibleFileNames: Array<string> = [selectedText];
    let altName: string = '';

    selectedText.match(/\w+/g)?.forEach((str) => {
      return (altName += str[0].toUpperCase() + str.substring(1));
    });

    if (altName) {
      possibleFileNames.push(altName);
    }
    console.log('possibleFileNames,', possibleFileNames);
    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`); // Returns promise
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Location | vscode.Location[] | any> {
    let filePaths = [];
    const componentNames = this.getComponentName(position);
    const searchPathActions = componentNames.map(this.searchFilePath);
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
