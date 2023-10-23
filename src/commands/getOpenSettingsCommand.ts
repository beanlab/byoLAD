import * as vscode from "vscode";

/**
 * Opens settings with a search for byoLAD, which
 * shows the fields for API key and model type.
 */
export const getOpenSettingsCommand = (): vscode.Disposable => {
  const openSettingsCommand = vscode.commands.registerCommand(
    "vscode-byolad.openSettingsCommand",
    async () => {
      vscode.commands.executeCommand("workbench.action.openSettings", "byoLAD");
    },
  );
  return openSettingsCommand;
};
