import * as vscode from "vscode";
import {
  doCompletion,
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
} from "../helpers";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
} from "./constants";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";

/**
 * Queries the model for a reviewed, edited version of the currently selected code.
 * Presents the suggestions on the selected code (in the context of the whole file) to the user according to their settings.
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
        async (completion, activeEditor) => {
          const documentTextBeforeSelection =
            getDocumentTextBeforeSelection(activeEditor);
          const documentTextAfterSelection =
            getDocumentTextAfterSelection(activeEditor);

          const newDocText =
            documentTextBeforeSelection +
            completion.completion +
            documentTextAfterSelection;

          await presentReviewResult(newDocText, activeEditor, settingsProvider);
        },
      );
    },
  );
};
