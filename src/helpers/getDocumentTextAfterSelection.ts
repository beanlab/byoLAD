import * as vscode from "vscode";

export const getDocumentTextAfterSelection = (
  activeEditor: vscode.TextEditor,
  selection: vscode.Selection
): string => {
  return activeEditor.document.getText(
    new vscode.Range(
      selection.end,
      new vscode.Position(
        activeEditor.document.lineCount - 1,
        activeEditor.document.lineAt(
          activeEditor.document.lineCount - 1
        ).text.length
      )
    )
  );
};
