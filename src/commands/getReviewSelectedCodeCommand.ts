import * as vscode from "vscode";
import {
  doChat,
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
  getInstructionAndCodeChatMessages,
} from "../helpers";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
  NO_CODE_TO_REVIEW_ERROR_MESSAGE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";
import { ChatMessage } from "../ChatModel/ChatModel";

/**
 * Queries the model for a reviewed, edited version of the currently selected code.
 * Presents the suggestions on the selected code (in the context of the whole file) to the user according to their settings.
 */
export const getReviewSelectedCodeCommand = (
  settingsProvider: SettingsProvider
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewSelectedCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection
      );
      if (!code) {
        vscode.window.showErrorMessage(NO_CODE_TO_REVIEW_ERROR_MESSAGE);
        return;
      }

      const modelInstruction =
        settingsProvider.getReviewSelectedCodePrompt() ||
        CODE_REVIEW_INSTRUCTION;
      const messages: ChatMessage[] = getInstructionAndCodeChatMessages(
        modelInstruction,
        code
      );

      doChat(
        settingsProvider.getChatModel(),
        messages,
        CODE_REVIEW_PROGRESS_TITLE,
        async (response, activeEditor) => {
          const documentTextBeforeSelection =
            getDocumentTextBeforeSelection(activeEditor);
          const documentTextAfterSelection =
            getDocumentTextAfterSelection(activeEditor);

          const newDocText =
            documentTextBeforeSelection +
            (response.message?.content ?? "") +
            documentTextAfterSelection;

          await presentReviewResult(newDocText, activeEditor, settingsProvider);
        }
      );
    }
  );
};
