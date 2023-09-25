import * as vscode from "vscode";
import {
  doCompletion,
  replaceTextAndCompare,
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
} from "../helpers";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
  EMPTY_COMPLETION_ERROR_MESSAGE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * Queries the model for a reviewed, edited version of the currently selected code.
 * Displays a diff of the active editor document and the completion response in context of the overall file.
 */
export const getReviewSelectedCodeCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewSelectedCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection,
      );
      const modelInstruction =
        settingsProvider.getReviewSelectedCodePrompt() ||
        CODE_REVIEW_INSTRUCTION;
      const progressTitle = CODE_REVIEW_PROGRESS_TITLE;

      doCompletion(
        settingsProvider.getCompletionModel(),
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) => {
          if (!completion.completion) {
            vscode.window.showErrorMessage(
              completion?.errorMessage || EMPTY_COMPLETION_ERROR_MESSAGE,
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
