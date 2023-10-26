import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { TextBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/conversationManager";
import { sendMessage } from "../helpers/sendMessage";
import { getCodeReferenceIfUserWants } from "../helpers/getCodeReferenceIfUserWants";
import { getCodeReference } from "../helpers/getCodeReference";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
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
        content:
          "Please review this code, fixing any bugs, adding any code comments as needed, improving naming decisions, etc.", // TODO: Get this from settings, change default to not provide the overall formatting instructions
      } as TextBlock;

      const codeReference = getCodeReference(activeEditor);

      await sendMessage(
        textBlock,
        codeReference,
        settingsProvider,
        conversationManager
      );
    }
  );
};
