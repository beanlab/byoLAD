import * as vscode from "vscode";
import {
  doCompletion,
  displayDiff,
  getDocumentTextBeforeSelection,
  getDocumentTextAfterSelection,
} from "../helpers";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
} from "./constants";
import { CompletionModelProvider } from "../CompletionModel/CompletionModelProvider";

/**
 * Queries the model for a reviewed, edited version of the currently selected code.
 * Displays a diff of the active editor document and the completion response in context of the overall file.
 */
export const getReviewSelectedCodeCommand = (
  completionModelProvider: CompletionModelProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewSelectedCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection,
      );
      const modelInstruction = CODE_REVIEW_INSTRUCTION;
      const progressTitle = CODE_REVIEW_PROGRESS_TITLE;

      doCompletion(
        completionModelProvider.getCompletionModel(),
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) => {
          const documentTextBeforeSelection =
            getDocumentTextBeforeSelection(activeEditor);
          const documentTextAfterSelection =
            getDocumentTextAfterSelection(activeEditor);

          const diffContent =
            documentTextBeforeSelection +
            completion.completion +
            documentTextAfterSelection;
          displayDiff(diffContent, activeEditor);
        },
      );
    },
  );
};
