import * as vscode from "vscode";

/**
 * Command to open the VS Code settings with a search for "byoLAD".
 */
export const getOpenSettingsCommand = (): vscode.Disposable => {
  const openSettingsCommand = vscode.commands.registerCommand(
    "vscode-byolad.openSettingsCommand",
    async () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "@ext:beanlabbyu.vscode-byolad",
      );
    },
  );
  return openSettingsCommand;
};
