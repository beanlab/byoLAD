import * as vscode from "vscode";

/**
 * Inserts the given code block into the active editor at the user's current selection.
 * If nothing is selected, the code block will be inserted at the present cursor position.
 * Throws an error if there is no active editor.
 *
 * @param content
 */
export async function insertCode(content: string): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor, cannot insert code.");
    return;
  }

  const selection = activeEditor.selection; // selection may be empty, but that's okay
  await activeEditor.edit((editBuilder) => {
    editBuilder.replace(selection, content);
  });
}
