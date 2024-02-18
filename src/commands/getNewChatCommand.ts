import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewMessageSender } from "../webview/ChatWebviewMessageSender";

/**
 * Command to start a new chat and make it the active chat.
 */
export const getNewChatCommand = (
  chatDataManager: ChatDataManager,
  chatWebviewMessageSender: ChatWebviewMessageSender,
): vscode.Disposable => {
  return vscode.commands.registerCommand("vscode-byolad.newChat", async () => {
    chatDataManager.startChat("Code Chat"); // TODO: How to name?
    await chatWebviewMessageSender.refresh();
  });
};
