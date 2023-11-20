import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getDeleteAllConversationsCommand = (
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.deleteAllConversations",
    () => {
      conversationManager.clearAllConversations();
      chatWebviewProvider.updateConversation(
        conversationManager.conversations,
        null,
      );
    },
  );
