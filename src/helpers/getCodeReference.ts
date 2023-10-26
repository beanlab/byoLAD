import * as vscode from "vscode";
import { CodeBlock } from "../ChatModel/ChatModel";

/**
 * Gets the code block that the user has selected in the active editor.
 * If nothing is selected, the whole document is selected.
 *
 * @param activeEditor
 * @returns
 */
export function getCodeReference(activeEditor: vscode.TextEditor): CodeBlock {
  let selection = activeEditor.selection;
  if (selection.isEmpty) {
    // selected the whole document if nothing else is already selected
    selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(activeEditor.document.lineCount || 0, 0),
    );
  }

  return {
    type: "code",
    content: activeEditor.document.getText(selection),
    languageId: activeEditor.document.languageId,
  };
}
