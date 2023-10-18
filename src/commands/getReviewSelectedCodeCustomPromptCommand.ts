import * as vscode from "vscode";
import {
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
  getUserPrompt,
  doChat,
  getInstructionAndCodeChatMessages,
} from "../helpers";
import {
  CODE_REVIEW_PROGRESS_TITLE,
  CUSTOM_PROMPT_TEMPLATE_PREFIX,
  CUSTOM_PROMPT_TEMPLATE_SUFFIX,
  INVALID_USER_INPUT_ERROR_MESSAGE,
  NO_CODE_TO_REVIEW_ERROR_MESSAGE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";
import { ChatMessage } from "../ChatModel/ChatModel";

/**
 * Collects a user inputted prompt to query the model for a reviewed, edited version of the currently selected code.
 * Presents the suggestions on the selected code (in the context of the whole file) to the user according to their settings.
 */
export const getReviewSelectedCodeCustomPromptCommand = (
  settingsProvider: SettingsProvider
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewSelectedCodeCustomPrompt",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
      if (!code) {
        vscode.window.showErrorMessage(NO_CODE_TO_REVIEW_ERROR_MESSAGE);
        return;
      }

      const modelInstruction =
        CUSTOM_PROMPT_TEMPLATE_PREFIX +
        (await getUserPrompt()) +
        CUSTOM_PROMPT_TEMPLATE_SUFFIX;
      if (!modelInstruction) {
        vscode.window.showErrorMessage(INVALID_USER_INPUT_ERROR_MESSAGE);
        return;
      }

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
