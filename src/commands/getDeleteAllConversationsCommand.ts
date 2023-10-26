import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/conversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getDeleteAllConversationsCommand = (
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.deleteAllConversations",
    () => {
      conversationManager.clearAllConversations();
      vscode.window.showInformationMessage("Cleared all conversations"); // TODO: Delete
      chatWebviewProvider.refresh(null);
    },
  );
