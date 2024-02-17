import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewMessageSender } from "../providers/ChatWebviewMessageSender";

/**
 * Command to clear the workspace chat history and unset the active chat.
 */
export const getDeleteAllChatsCommand = (
  chatDataManager: ChatDataManager,
  chatWebviewMessageSender: ChatWebviewMessageSender,
) =>
  vscode.commands.registerCommand("vscode-byolad.deleteAllChats", async () => {
    chatDataManager.clearAllChats();
    await chatWebviewMessageSender.refresh();
  });
