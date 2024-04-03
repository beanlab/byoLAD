import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

/**
 * Command to clear the workspace chat history and unset the active chat.
 */
export const getDeleteAllChatsCommand = (
  chatDataManager: ChatDataManager,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
) =>
  vscode.commands.registerCommand("vscode-byolad.deleteAllChats", async () => {
    chatDataManager.clearAllChats();
    await extensionToWebviewMessageSender.refresh();
  });
