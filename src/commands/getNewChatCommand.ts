import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

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
