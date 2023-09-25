import * as vscode from "vscode";

/**
 * Replaces the actived editor document text with the provided text that contains the AI's edits and opens a revertable diff view.
 *
 * @param newDocText Text to compare to the active editor document text
 * @param activeEditor The active editor to compare to the new text
 */
export async function replaceTextAndCompare(
  newDocText: string | undefined,
  activeEditor: vscode.TextEditor,
) {
  const doc = activeEditor.document;
  doc.save(); // save the document so that the comparison is with the most recent version of the file

  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    doc.uri,
    new vscode.Range(
      new vscode.Position(0, 0),
      doc.lineAt(doc.lineCount - 1).range.end,
    ),
    newDocText ?? "",
  );
  await vscode.workspace.applyEdit(edit);

  // this command is the vscode built in command to compare the current file (which includes the AI's edits)
  // with the saved version of the file (what the user had before using the extension)
  vscode.commands.executeCommand("workbench.files.action.compareWithSaved");
}
