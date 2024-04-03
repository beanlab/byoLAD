import * as vscode from "vscode";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

/**
 * Handler for when the VS Code text editor selection (highlight) changes.
 * Notifies the chat webview provider as to whether or not there is a selection.
 */
export const getOnDidChangeTextEditorSelectionHandler = (
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
): vscode.Disposable => {
  return vscode.window.onDidChangeTextEditorSelection(async (e) => {
    await extensionToWebviewMessageSender.updateHasSelection(
      !e.selections[0].isEmpty,
    );
  });
};
