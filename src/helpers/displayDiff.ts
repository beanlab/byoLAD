import * as vscode from "vscode";

/**
 * Displays a diff comparison of the active editor document and the provided content in a new editor.
 *
 * @param diffText Text to compare to the active editor document text
 * @param activeEditor The active editor to compare to the diff text
 */
export async function displayDiff(
  diffText: string | undefined,
  activeEditor: vscode.TextEditor,
) {
  const tempFile = await vscode.workspace.openTextDocument({
    content: diffText ?? "",
    language: activeEditor.document.languageId,
  });

  vscode.commands.executeCommand(
    "vscode.diff",
    activeEditor.document.uri,
    tempFile.uri,
  );
}
