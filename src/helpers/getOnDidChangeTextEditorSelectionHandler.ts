import * as vscode from "vscode";
import { ChatWebviewMessageSender } from "../webview/ChatWebviewMessageSender";

/**
 * Handler for when the VS Code text editor selection (highlight) changes.
 * Notifies the chat webview provider as to whether or not there is a selection.
 */
export const getOnDidChangeTextEditorSelectionHandler = (
  chatWebviewMessageSender: ChatWebviewMessageSender,
): vscode.Disposable => {
  return vscode.window.onDidChangeTextEditorSelection(async (e) => {
    await chatWebviewMessageSender.updateHasSelection(!e.selections[0].isEmpty);
  });
};
