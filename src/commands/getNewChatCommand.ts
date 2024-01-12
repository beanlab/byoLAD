import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

/**
 * Command to start a new chat and make it the active chat.
 */
export const getNewChatCommand = (
  settingsProvider: SettingsProvider,
  chatManager: ChatManager,
  chatViewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand("vscode-byolad.newChat", async () => {
    const activeChat = chatManager.startChat("Code Chat"); // TODO: How to name?
    chatViewProvider.updateChat(chatManager.chats, activeChat.id);
  });
};
