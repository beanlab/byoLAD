import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getDeleteConversationCommand = (
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.deleteConversation",
    async (conversationId: number) => {
      conversationManager.deleteConversation(conversationId);
      chatWebviewProvider.updateConversationList(
        conversationManager.conversations,
      );
    },
  );
};
