import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/conversationManager";
import { activate } from "../extension";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { getCodeReferenceIfUserWants } from "../helpers/getCodeReferenceIfUserWants";
import { sendMessage } from "../helpers/sendMessage";

// TODO: use constants and such
export const getStartConversationCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.startConversation",
    async () => {
      // throw error if not active editor
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
        return;
      }

      const selectedCommand = await vscode.window.showQuickPick([
        "Review code", // TODO: use constants
        "Explain code",
        "Input prompt",
      ]);
      if (!selectedCommand) {
        vscode.window.showErrorMessage("No command selected"); // TODO: How to handle?
        return;
      }

      switch (selectedCommand) {
        case "Review code":
          conversationManager.startConversation("Code Chat"); // TODO: How to name?
          await vscode.commands.executeCommand("vscode-byolad.reviewCode"); // TODO: Use constants
          break;
        case "Explain code":
          conversationManager.startConversation("Code Chat"); // TODO: How to name?
          await vscode.commands.executeCommand("vscode-byolad.explainCode");
          break;
        case "Input prompt":
          conversationManager.startConversation("Code Chat"); // TODO: How to name?
          await vscode.commands.executeCommand("vscode-byolad.sendMessage");
          break;
        default:
          vscode.window.showErrorMessage("Unknown command"); // TODO: How to handle?
          return;
      }
    }
  );
};
