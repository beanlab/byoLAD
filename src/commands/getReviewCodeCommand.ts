import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatRole, TextBlock } from "../ChatModel/ChatModel";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { getCodeReference } from "../helpers/getCodeReference";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndConversation } from "../helpers/ensureActiveWebviewAndConversation";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
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

      await ensureActiveWebviewAndConversation(
        conversationManager,
        chatWebviewProvider,
      );
      await sendChatMessage(
        message,
        settingsProvider,
        conversationManager,
        chatWebviewProvider,
      );
    },
  );
};
