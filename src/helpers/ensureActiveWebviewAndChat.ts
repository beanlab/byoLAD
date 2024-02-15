import * as vscode from "vscode";

import { ChatWebviewProvider } from "../providers/ChatWebviewProvider";
import { ChatDataManager } from "../Chat/ChatDataManager";

/**
 * Makes sure there is an active chat in the open webview panel.
 * If there is no open webview panel, it is opened and a new chat is created.
 * Or, if there is an open webview panel but there is no active chat, a new one is created.
 *
 * @param chatDataManager
 * @param chatWebviewProvider
 */
export async function ensureActiveWebviewAndChat(
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  if (!chatWebviewProvider.isWebviewVisible()) {
    // Built-in webview command to open the webview
    await vscode.commands.executeCommand("vscode-byolad.chat.focus");
    await vscode.commands.executeCommand("vscode-byolad.newChat");
  } else if (!chatDataManager.getActiveChat()) {
    await vscode.commands.executeCommand("vscode-byolad.newChat");
  }
}
