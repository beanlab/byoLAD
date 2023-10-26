import * as vscode from "vscode";
import { ChatViewProvider } from "../providers/ChatViewProvider";
import { ConversationManager } from "../Conversation/conversationManager";

export const getRefreshChatViewCommand = (
  provider: ChatViewProvider,
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
