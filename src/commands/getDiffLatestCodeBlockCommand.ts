import * as vscode from "vscode";
import { CodeBlock } from "../ChatModel/ChatModel";
import { Conversation } from "../Conversation/conversation";

import { ConversationManager } from "../Conversation/conversationManager";
import {
  getDocumentTextAfterSelection,
  getDocumentTextBeforeSelection,
} from "../helpers";
import { displayDiff } from "../helpers/displayDiff";
import { SettingsProvider } from "../helpers/SettingsProvider";

/**
 * The command to display a diff of the most recent code block in the active conversation.
 * Throws an error if there is no active editor, no active conversation, no code block in the conversation, or no reference lines.
 *
 * @param settingsProvider
 * @param conversationManager
 * @returns
 */
export const getDiffLatestCodeBlockCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.diffLatestCodeBlock",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage(
          "No active editor, cannot display diff."
        );
        return;
      }

      const conversation = conversationManager.getActiveConversation();
      if (!conversation) {
        vscode.window.showErrorMessage(
          "No active conversation, cannot retrieve code block."
        );
        return;
      }

      const codeBlock = getLatestCodeBlock(conversation);
      if (!codeBlock) {
        vscode.window.showErrorMessage(
          "No code block found in the most recent message."
        );
        return;
      }

      const selection = getSelectionFromCodeBlock(codeBlock);
      if (!selection) {
        vscode.window.showErrorMessage(
          "No code block lines found in the most recent code block."
        );
        return;
      }

      const newDocText = getNewDocumentText(activeEditor, selection, codeBlock);
      await displayDiff(newDocText, activeEditor, settingsProvider);
    }
  );
};

/**
 * Gets the most recent code block in the conversation.
 *
 * @param conversation
 * @returns The most recent code block or null if no code block is found.
 */
function getLatestCodeBlock(conversation: Conversation): CodeBlock | null {
  for (let i = conversation.messages.length - 1; i >= 0; i--) {
    const chatMessages = conversation.messages[i].content;
    for (let j = chatMessages.length - 1; j >= 0; j--) {
      if (chatMessages[j].type === "code") {
        return chatMessages[j] as CodeBlock;
      }
    }
  }
  return null;
}

/**
 * Gets the selection to replace with the code block in the active editor based on the code block's lines in the user source file.
 *
 * @param codeBlock
 * @returns Selection or null if the code block's lines in the user source file are not defined.
 */
function getSelectionFromCodeBlock(
  codeBlock: CodeBlock
): vscode.Selection | null {
  const codeBlockStartLine = codeBlock.linesInUserSourceFile?.start;
  const codeBlockEndLine = codeBlock.linesInUserSourceFile?.end;
  if (codeBlockStartLine === undefined || codeBlockEndLine === undefined) {
    return null;
  }
  return new vscode.Selection(
    new vscode.Position(codeBlockStartLine, 0),
    new vscode.Position(codeBlockEndLine, 0)
  );
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
  codeBlock: CodeBlock
): string {
  const documentTextBeforeSelection = getDocumentTextBeforeSelection(
    activeEditor,
    selection
  );
  const documentTextAfterSelection = getDocumentTextAfterSelection(
    activeEditor,
    selection
  );
  return (
    documentTextBeforeSelection + codeBlock.content + documentTextAfterSelection
  );
}
