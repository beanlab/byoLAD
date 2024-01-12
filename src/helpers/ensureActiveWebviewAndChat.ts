import * as vscode from "vscode";

import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ChatManager } from "../Chat/ChatManager";

/**
 * Makes sure there is an active chat in the open webview panel.
 * If there is no open webview panel, it is opened and a new chat is created.
 * Or, if there is no active chat, a new one is created.
 *
 * @param chatManager
 * @param chatWebviewProvider
 */
export async function ensureActiveWebviewAndChat(
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  if (!chatWebviewProvider.isWebviewVisible()) {
    await vscode.commands.executeCommand("vscode-byolad.newChat");
    // Built-in webview command to open the webview
    await vscode.commands.executeCommand("vscode-byolad.chat.focus");
  }
  if (!chatManager.getActiveChat()) {
    await vscode.commands.executeCommand("vscode-byolad.newChat");
  }
}
