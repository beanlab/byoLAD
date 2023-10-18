import * as vscode from "vscode";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
  NO_CODE_TO_REVIEW_ERROR_MESSAGE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";
import { doChat, getInstructionAndCodeChatMessages } from "../helpers";
import { ChatMessage } from "../ChatModel/ChatModel";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
 */
export const getReviewFileCodeCommand = (
  settingsProvider: SettingsProvider
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewFileCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
      if (!code) {
        vscode.window.showErrorMessage(NO_CODE_TO_REVIEW_ERROR_MESSAGE);
        return;
      }

      const modelInstruction =
        settingsProvider.getReviewFileCodePrompt() || CODE_REVIEW_INSTRUCTION;
      const messages: ChatMessage[] = getInstructionAndCodeChatMessages(
        modelInstruction,
        code
      );

      doChat(
        settingsProvider.getChatModel(),
        messages,
        CODE_REVIEW_PROGRESS_TITLE,
        async (response, activeEditor) =>
          await presentReviewResult(
            response.message?.content,
            activeEditor,
            settingsProvider
          )
      );
    }
  );
};
