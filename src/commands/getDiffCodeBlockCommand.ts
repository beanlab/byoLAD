import * as vscode from "vscode";

import { CodeBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/conversationManager";
import {
  getDocumentTextAfterSelection,
  getDocumentTextBeforeSelection,
} from "../helpers";
import { displayDiff } from "../helpers/displayDiff";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * The command to display a diff of the given code block in the active conversation with the user's current selection in the editor.
 * If nothing is selected, the diff will be against an insertion at the present cursor position.
 * Throws an error if there is no active editor, no active conversation, or no code block in the conversation.
 *
 * @param settingsProvider
 * @param conversationManager
 * @returns
 */
export const getDiffCodeBlockCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.diffCodeBlock",
    async (codeBlock: CodeBlock) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage(
          "No active editor, cannot display diff.",
        );
        return;
      }

      const conversation = conversationManager.getActiveConversation();
      if (!conversation) {
        vscode.window.showErrorMessage(
          "No active conversation, cannot retrieve code block.",
        );
        return;
      }

      const selection = activeEditor.selection; // selection may be empty, but that's okay
      const newDocText = getNewDocumentText(activeEditor, selection, codeBlock);
      await displayDiff(newDocText, activeEditor, settingsProvider);
    },
  );
};

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
  codeBlock: CodeBlock,
): string {
  const documentTextBeforeSelection = getDocumentTextBeforeSelection(
    activeEditor,
    selection,
  );
  const documentTextAfterSelection = getDocumentTextAfterSelection(
    activeEditor,
    selection,
  );
  return (
    documentTextBeforeSelection + codeBlock.content + documentTextAfterSelection
  );
}
