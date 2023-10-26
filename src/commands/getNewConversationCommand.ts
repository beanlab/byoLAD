import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/conversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";

export const getNewConversationCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.newConversation",
    async () => {
      conversationManager.startConversation("Code Chat"); // TODO: How to name?
    },
  );
};
