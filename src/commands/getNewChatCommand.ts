import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatWebviewProvider";

/**
 * Command to start a new chat and make it the active chat.
 */
export const getNewChatCommand = (
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand("vscode-byolad.newChat", async () => {
    await vscode.commands.executeCommand("vscode-byolad.chat.focus");
    chatDataManager.startChat("Code Chat"); // TODO: How to name?
    chatWebviewProvider.refresh();
  });
};
