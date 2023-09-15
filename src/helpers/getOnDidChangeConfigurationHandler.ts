import * as vscode from "vscode";
import { SettingsProvider } from "./SettingsProvider";

export const getOnDidChangeConfigurationHandler = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("vs-code-ai-extension")) {
      settingsProvider.setConfig(
        vscode.workspace.getConfiguration("vs-code-ai-extension"),
      );
    }
  });
};
