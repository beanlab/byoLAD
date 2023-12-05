import * as vscode from "vscode";

import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ConversationManager } from "../Conversation/ConversationManager";

/**
 * Makes sure there is an active conversation in the open webview panel.
 * If there is no open webview panel, it is opened and a new conversation is created.
 * Or, if there is no active conversation, a new one is created.
 *
 * @param conversationManager
 * @param chatWebviewProvider
 */
export async function ensureActiveWebviewAndConversation(
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  if (!chatWebviewProvider.isWebviewVisible()) {
    await vscode.commands.executeCommand("vscode-byolad.newConversation");
    // Built-in webview command to open the webview
    await vscode.commands.executeCommand("vscode-byolad.chat.focus");
  }
  if (!conversationManager.getActiveConversation()) {
    await vscode.commands.executeCommand("vscode-byolad.newConversation");
  }
}
