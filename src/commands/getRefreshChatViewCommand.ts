import * as vscode from "vscode";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ConversationManager } from "../Conversation/ConversationManager";

export const getRefreshChatViewCommand = (
  provider: ChatWebviewProvider,
  conversationManager: ConversationManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.refreshChatView", () => {
    const conversation = conversationManager.getActiveConversation();
    if (!conversation) {
      vscode.window.showErrorMessage("No active conversation"); // TODO: How to handle?
      return;
    }
    provider.refresh(conversation);
  });
