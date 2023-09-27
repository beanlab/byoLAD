import * as vscode from "vscode";
import {
  CODE_REVIEW_PROGRESS_TITLE,
  CUSTOM_PROMPT_TEMPLATE_PREFIX,
  CUSTOM_PROMPT_TEMPLATE_SUFFIX,
  INVALID_USER_INPUT_ERROR_MESSAGE,
} from "./constants";
import { doCompletion, getUserPrompt } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { presentReviewResult } from "../helpers/presentReviewResult";

/**
 * Collects a user inputted prompt to query the model for a reviewed, edited version of the current file contents.
 * Presents the suggestions to the user according to their settings.
 */
export const getReviewFileCodeCustomPromptCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  const reviewFileCodeCommand = vscode.commands.registerCommand(
    "vscode-byolad.reviewFileCodeCustomPrompt",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
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
