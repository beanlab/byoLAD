import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/ConversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getNewConversationCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  chatViewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.newConversation",
    async () => {
      const activeConversation =
        conversationManager.startConversation("Code Chat"); // TODO: How to name?
      chatViewProvider.updateConversation(
        conversationManager.conversations,
        activeConversation.id,
      );
    },
  );
};
