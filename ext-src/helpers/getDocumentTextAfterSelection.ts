import * as vscode from "vscode";

export const getDocumentTextAfterSelection = (
  activeEditor: vscode.TextEditor,
): string => {
  return activeEditor.document.getText(
    new vscode.Range(
      activeEditor.selection.end,
      new vscode.Position(
        activeEditor.document.lineCount - 1,
        activeEditor.document.lineAt(
          activeEditor.document.lineCount - 1,
        ).text.length,
      ),
    ),
  );
};
