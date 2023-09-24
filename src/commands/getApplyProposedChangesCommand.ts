import * as vscode from "vscode";
import { TextProviderScheme } from "../helpers/types";

/**
 * Applies the proposed changes to the actual (not virtual) file with the same paths
 * the active editor document (which should be part of the diff comparison).
 * Closes the active editor and opens the updated file.
 * Does not save the file after changes are applied.
 */
export const getApplyProposedChangesCommand = (): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.applyProposedChanges",
    async () => {
      if (!vscode.window.activeTextEditor) {
        return;
      }
      const { document } = vscode.window.activeTextEditor;
      if (document.uri.scheme != TextProviderScheme.AiCodeReview) {
        return;
      }

      // The document.uri.path doesn't include the code review scheme and is thus the uri the actual file path we want to edit.
      // This is dependent on how the uri was established when opening said file in the first place.
      const uriToUpdate = vscode.Uri.file(document.uri.path);
      const edit = new vscode.WorkspaceEdit();
      edit.replace(
        uriToUpdate,
        new vscode.Range(0, 0, document.lineCount, 0),
        document.getText(),
      );
      await vscode.workspace.applyEdit(edit);

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
      await vscode.window.showTextDocument(uriToUpdate);
    },
  );
};
