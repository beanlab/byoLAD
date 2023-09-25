import * as vscode from "vscode";
import {
  doCompletion,
  replaceTextAndCompare,
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
  getUserPrompt,
} from "../helpers";
import {
  CODE_REVIEW_PROGRESS_TITLE,
  CUSTOM_PROMPT_TEMPLATE_PREFIX,
  CUSTOM_PROMPT_TEMPLATE_SUFFIX,
  INVALID_USER_INPUT_ERROR_MESSAGE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * Collects a user inputted prompt to query the model for a reviewed, edited version of the currently selected code.
 * Displays a diff of the active editor document and the completion response in context of the overall file.
 */
export const getReviewSelectedCodeCustomPromptCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewSelectedCodeCustomPrompt",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection,
      );

      const modelInstruction =
        CUSTOM_PROMPT_TEMPLATE_PREFIX +
        (await getUserPrompt()) +
        CUSTOM_PROMPT_TEMPLATE_SUFFIX;
      const progressTitle = CODE_REVIEW_PROGRESS_TITLE;

      if (!modelInstruction) {
        vscode.window.showErrorMessage(INVALID_USER_INPUT_ERROR_MESSAGE);
        return;
      }

      doCompletion(
        settingsProvider.getCompletionModel(),
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) => {
          if (!completion.completion) {
            vscode.window.showErrorMessage(
              completion?.errorMessage || "No completion returned",
            );
            return;
          }

          const documentTextBeforeSelection =
            getDocumentTextBeforeSelection(activeEditor);
          const documentTextAfterSelection =
            getDocumentTextAfterSelection(activeEditor);

          const newDocText =
            documentTextBeforeSelection +
            completion.completion +
            documentTextAfterSelection;
          replaceTextAndCompare(newDocText, activeEditor);
        },
      );
    },
  );
};
