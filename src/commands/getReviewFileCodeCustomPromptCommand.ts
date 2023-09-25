import * as vscode from "vscode";
import {
  CODE_REVIEW_PROGRESS_TITLE,
  CUSTOM_PROMPT_TEMPLATE_PREFIX,
  CUSTOM_PROMPT_TEMPLATE_SUFFIX,
  EMPTY_COMPLETION_ERROR_MESSAGE,
  INVALID_USER_INPUT_ERROR_MESSAGE,
} from "./constants";
import { doCompletion, replaceTextAndCompare, getUserPrompt } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * Collects a user inputted prompt to query the model for a reviewed, edited version of the current file contents.
 * Displays a diff of the active editor document and the completion response.
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
        (completion, activeEditor) => {
          if (!completion.completion) {
            vscode.window.showErrorMessage(
              completion?.errorMessage || EMPTY_COMPLETION_ERROR_MESSAGE,
            );
            return;
          }
          replaceTextAndCompare(completion.completion, activeEditor);
        },
      );
    },
  );
  return reviewFileCodeCommand;
};
