import * as vscode from "vscode";
import {
  CompletionModel,
  CompletionModelResponse,
} from "../CompletionModel/CompletionModel";

/**
 * Gets a completion from the model given code and instructions, and handles the response.
 * Checks for input/response errors along the way. Handles a failed completion response.
 *
 * @param code The code to act on in the completion model
 * @param instruction The instructions for the completion model
 * @param handleResponse The function to handle a successful response from the completion model
 */
export function doCompletion(
  completionModel: CompletionModel,
  code: string | undefined,
  instruction: string,
  progressTitle: string,
  handleResponse: (
    completion: CompletionModelResponse,
    activeEditor: vscode.TextEditor,
  ) => void,
) {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }
  if (!code) {
    vscode.window.showErrorMessage("No input code");
    return;
  }

  let completion: CompletionModelResponse | undefined;
  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false, // TODO: make this cancellable (or have a configurable timeout or something)
        title: progressTitle,
      },
      async () => {
        completion = await completionModel.complete({
          instruction: instruction,
          code: code,
        });
      },
    )
    .then(async () => {
      if (completion && completion.success && completion.completion) {
        handleResponse(completion, activeEditor);
        return;
      }
      if (!completion) {
        vscode.window.showErrorMessage("No response from completion model");
      } else {
        vscode.window.showErrorMessage(
          completion?.errorMessage ||
            "Unknown error occurred while getting completion",
        );
      }
    });
}
