import * as vscode from "vscode";
import {
  ChatModel,
  ChatMessage,
  ChatModelResponse,
} from "../ChatModel/ChatModel";
import {
  EMPTY_RESPONSE_ERROR_MESSAGE,
  NO_RESPONSE_ERROR_MESSAGE,
  UNKNOWN_RESPONSE_ERROR_MESSAGE,
} from "../commands/constants";

export function doChat(
  chatModel: ChatModel,
  messages: ChatMessage[],
  progressTitle: string,
  handleResponse: (
    response: ChatModelResponse,
    activeEditor: vscode.TextEditor
  ) => void
) {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  let response: ChatModelResponse | undefined;
  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: progressTitle,
      },
      async () => {
        response = await chatModel.chat({
          messages: messages,
        });
      }
    )
    .then(async () => {
      if (response && response.success && response.message) {
        handleResponse(response, activeEditor);
      } else if (!response) {
        vscode.window.showErrorMessage(NO_RESPONSE_ERROR_MESSAGE);
      } else if (!response.message) {
        vscode.window.showErrorMessage(
          response?.errorMessage || EMPTY_RESPONSE_ERROR_MESSAGE
        );
      } else {
        vscode.window.showErrorMessage(
          response?.errorMessage || UNKNOWN_RESPONSE_ERROR_MESSAGE
        );
      }
    });
}
