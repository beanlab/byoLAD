import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatRole, TextBlock } from "../ChatModel/ChatModel";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { getCodeReference } from "../helpers/getCodeReference";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

/**
 * Command to review the selected code (or whole file if no selection) in a chat.
 * Sends the selection/file and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewCode",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
        return;
      }

      const textBlock = {
        type: "text",
        content: settingsProvider.getReviewCodePrompt(),
      } as TextBlock;

      const codeReference = getCodeReference(activeEditor);

      const message = {
        role: ChatRole.User,
        content: codeReference ? [textBlock, codeReference] : [textBlock],
      };

      await ensureActiveWebviewAndChat(chatManager, chatWebviewProvider);
      await sendChatMessage(
        message,
        settingsProvider,
        chatManager,
        chatWebviewProvider,
      );
    },
  );
};
