import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getEditTitleOfChatCommand = (
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.EditTitleOfChat",
    async (id: number, new_title: string) => {
      conversationManager.editTitleOfChat(id, new_title);
      chatWebviewProvider.updateConversationList(
        conversationManager.conversations,
      );
    },
  );
};
