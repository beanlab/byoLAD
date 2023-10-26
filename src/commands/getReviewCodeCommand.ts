import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { TextBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/conversationManager";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { getCodeReference } from "../helpers/getCodeReference";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
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

      await sendChatMessage(
        textBlock,
        codeReference,
        settingsProvider,
        conversationManager,
      );
    },
  );
};
