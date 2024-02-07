import * as vscode from "vscode";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

/**
 * Handler for when the VS Code text editor selection (highlight) changes.
 * Notifies the chat webview provider as to whether or not there is a selection.
 */
export const getOnDidChangeTextEditorSelectionHandler = (
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.window.onDidChangeTextEditorSelection((e) => {
    if (e.selections[0].isEmpty) {
      chatWebviewProvider.updateHasSelection(false);
    } else {
      chatWebviewProvider.updateHasSelection(true);
    }
  });
};
