import * as vscode from "vscode";

export const getDocumentTextBeforeSelection = (
  activeEditor: vscode.TextEditor,
): string => {
  return activeEditor.document.getText(
    new vscode.Range(new vscode.Position(0, 0), activeEditor.selection.start),
  );
};
