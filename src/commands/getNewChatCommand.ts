import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

/**
 * Command to start a new chat and make it the active chat.
 */
export const getNewChatCommand = (
  chatDataManager: ChatDataManager,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
): vscode.Disposable => {
  return vscode.commands.registerCommand("vscode-byolad.newChat", async () => {
    chatDataManager.startChat();
    await extensionToWebviewMessageSender.refresh();
  });
};
