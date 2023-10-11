import * as vscode from "vscode";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
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
