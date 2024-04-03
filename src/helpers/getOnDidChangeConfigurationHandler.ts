import * as vscode from "vscode";
import { SettingsProvider } from "./SettingsProvider";

/**
 * Handler for when the VS Code settings change.
 * Updates the settings provider with the new settings because the settings provider
 * is not automatically updated when the settings change.
 */
export const getOnDidChangeConfigurationHandler = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("vscode-byolad")) {
      settingsProvider.setConfig(
        vscode.workspace.getConfiguration("vscode-byolad"),
      );
    }
  });
};
