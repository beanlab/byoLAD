import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";

/**
 * Command to add the selected code (or whole file if no selection) to the active chat.
 * Opens webview and/or starts chat if necessary.
 */

export const getAddCodeToChatCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  chatManager: ChatManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.addCodeToChat", async () => {
    addSelectedCodeToChat(chatManager, chatWebviewProvider);
    chatWebviewProvider.updateChat(chatManager.chats, chatManager.activeChatId);
  });
