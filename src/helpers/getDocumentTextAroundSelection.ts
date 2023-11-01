import * as vscode from "vscode";

export const getDocumentTextBeforeSelection = (
  activeEditor: vscode.TextEditor,
  selection: vscode.Selection,
): string => {
  return activeEditor.document.getText(
    new vscode.Range(new vscode.Position(0, 0), selection.start),
  );
};

export const getDocumentTextAfterSelection = (
  activeEditor: vscode.TextEditor,
  selection: vscode.Selection,
): string => {
  return activeEditor.document.getText(
    new vscode.Range(
      selection.end,
      new vscode.Position(
        activeEditor.document.lineCount - 1,
        activeEditor.document.lineAt(
          activeEditor.document.lineCount - 1,
        ).text.length,
      ),
    ),
  );
};
