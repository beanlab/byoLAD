import * as vscode from "vscode";
import { CodeBlock } from "../ChatModel/ChatModel";

/**
 * Gets the code block that the user has selected in the active editor.
 * If nothing is selected, the whole document is selected.
 * The selection is expanded to use the full lines that the selection is on for easier processing.
 *
 * @param activeEditor
 * @returns
 */
export function getCodeReference(activeEditor: vscode.TextEditor): CodeBlock {
  let selection = activeEditor.selection;
  if (selection.isEmpty) {
    // selected the whole document if nothing else is selected
    selection = new vscode.Selection(
      new vscode.Position(0, 0),
      new vscode.Position(activeEditor.document.lineCount || 0, 0)
    );
  } else {
    // expand selection to full lines
    selection = new vscode.Selection(
      new vscode.Position(selection.start.line, 0),
      new vscode.Position(selection.end.line + 1, 0) // +1 because the end position is exclusive
    );
  }

  return {
    type: "code",
    content: activeEditor.document.getText(selection),
    languageId: activeEditor.document.languageId,
    linesInUserSourceFile: {
      start: selection.start.line,
      end: selection.end.line,
    },
  };
}
