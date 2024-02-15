import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatWebviewProvider";

/**
 * Command to clear the workspace chat history and unset the active chat.
 */
export const getDeleteAllChatsCommand = (
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand("vscode-byolad.deleteAllChats", () => {
    chatDataManager.clearAllChats();
    chatWebviewProvider.refresh();
  });
