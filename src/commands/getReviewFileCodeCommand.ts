import * as vscode from "vscode";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
} from "./constants";
import { doCompletion, displayDiff } from "../helpers";
import { CompletionModel } from "../CompletionModel/CompletionModel";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Displays a diff of the active editor document and the completion response.
 */
export const getReviewFileCodeCommand = (
  completionModel: CompletionModel,
): vscode.Disposable => {
  const reviewFileCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewFileCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
      const modelInstruction = CODE_REVIEW_INSTRUCTION;
      const progressTitle = CODE_REVIEW_PROGRESS_TITLE;

      doCompletion(
        completionModel,
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) =>
          displayDiff(completion.completion, activeEditor),
      );
    },
  );
  return reviewFileCodeCommand;
};
