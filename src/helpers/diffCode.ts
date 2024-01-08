import * as vscode from "vscode";

import {
  getDocumentTextAfterSelection,
  getDocumentTextBeforeSelection,
} from ".";
import { displayDiff } from "./displayDiff";
import { SettingsProvider } from "./SettingsProvider";

/**
 * Displays a diff of the given code block in the active chat with the user's current selection in the editor.
 * If nothing is selected, the diff will be against an insertion at the present cursor position.
 * Throws an error if there is no active editor, no active chat, or no code block in the chat.
 *
 * @param content
 * @param settingsProvider
 */
export async function diffCode(
  content: string,
  settingsProvider: SettingsProvider,
): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor, cannot display diff.");
    return;
  }

  const selection = activeEditor.selection; // selection may be empty, but that's okay
  const newDocText = getNewDocumentText(activeEditor, selection, content);
  await displayDiff(newDocText, activeEditor, settingsProvider);
}

/**
 * Gets the proposed version of the document text after the code block is applied.
 *
 * @param activeEditor
 * @param selection The selection to replace with the code block in the active editor.
 * @param codeBlock
 * @returns
 */
function getNewDocumentText(
  activeEditor: vscode.TextEditor,
  selection: vscode.Selection,
  content: string,
): string {
  const documentTextBeforeSelection = getDocumentTextBeforeSelection(
    activeEditor,
    selection,
  );
  const documentTextAfterSelection = getDocumentTextAfterSelection(
    activeEditor,
    selection,
  );
  return documentTextBeforeSelection + content + documentTextAfterSelection;
}
