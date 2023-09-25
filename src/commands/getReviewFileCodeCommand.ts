import * as vscode from "vscode";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
} from "./constants";
import { doCompletion, displayDiff } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Displays a diff of the active editor document and the completion response.
 */
export const getReviewFileCodeCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  const reviewFileCodeCommand = vscode.commands.registerCommand(
    "vscode-byolad.reviewFileCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
      const modelInstruction =
        settingsProvider.getReviewFileCodePrompt() || CODE_REVIEW_INSTRUCTION;
      const progressTitle = CODE_REVIEW_PROGRESS_TITLE;

      doCompletion(
        settingsProvider.getCompletionModel(),
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
