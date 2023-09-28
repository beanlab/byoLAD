import * as vscode from "vscode";
import { SettingsProvider } from "./SettingsProvider";

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
