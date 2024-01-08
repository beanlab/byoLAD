import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getDeleteChatCommand = (
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.deleteChat",
    async (chatId: number) => {
      chatManager.deleteChat(chatId);
      chatWebviewProvider.updateChatList(chatManager.chats);
    },
  );
};
