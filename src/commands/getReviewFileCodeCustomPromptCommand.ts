import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";

export const getReviewFileCodeCustomPromptCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewFileCodeCustomPrompt",
    async () => {
      // TODO: Implement this command
      console.log(settingsProvider.getReviewFileCodePrompt());
      console.log("reviewFileCodeCustomPromptCommand");
      return;
    },
  );
};
