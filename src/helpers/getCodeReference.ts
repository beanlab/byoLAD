import * as vscode from "vscode";
import { CodeBlock } from "../../shared/types";

/**
 * Gets the currently selected text as a code block. If nothing is selected, returns null.
 */
export function getSelectedTextAsCodeBlock(
  activeEditor: vscode.TextEditor,
): CodeBlock | null {
  const selection = activeEditor.selection;
  if (selection.isEmpty) {
    return null;
  }
  return {
    type: "code",
    content: activeEditor.document.getText(selection),
    languageId: activeEditor.document.languageId,
  } as CodeBlock;
}

/**
 * Gets the entire file content as a code block.
 */
export function getFileContentAsCodeBlock(
  activeEditor: vscode.TextEditor,
): CodeBlock {
  return {
    type: "code",
    content: activeEditor.document.getText(),
    languageId: activeEditor.document.languageId,
  } as CodeBlock;
}
