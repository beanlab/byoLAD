import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

/**
 * Command to clear the workspace chat history and unset the active chat.
 */
export const getDeleteAllChatsCommand = (
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand("vscode-byolad.deleteAllChats", () => {
    chatManager.clearAllChats();
    chatWebviewProvider.updateChat(chatManager.chats, null);
  });
