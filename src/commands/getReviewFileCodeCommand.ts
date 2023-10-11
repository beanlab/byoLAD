import * as vscode from "vscode";
import {
  CODE_REVIEW_INSTRUCTION,
  CODE_REVIEW_PROGRESS_TITLE,
} from "./constants";
import { doCompletion } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";

/**
 * Queries the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
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
        async (completion, activeEditor) =>
          await presentReviewResult(
            completion.completion,
            activeEditor,
            settingsProvider,
          ),
      );
    },
  );
  return reviewFileCodeCommand;
};
