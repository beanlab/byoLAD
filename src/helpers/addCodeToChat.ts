import * as vscode from "vscode";
import { Chat, ChatRole } from "../../shared/types";
import {
  getFileContentAsCodeBlock,
  getSelectedTextAsCodeBlock,
} from "./getCodeBlock";
import { ChatEditor } from "../Chat/ChatEditor";

/**
 * Adds the currently selected code (or the entire file content if nothing is selected)
 * to the chat and updates the webview accordingly.
 * @param chat
 * @param chatEditor
 * @returns
 */
export async function addCodeToChat(chat: Chat, chatEditor: ChatEditor) {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showErrorMessage("No active editor");
    return;
  }

  let code = getSelectedTextAsCodeBlock(activeEditor);
  if (!code) {
    code = getFileContentAsCodeBlock(activeEditor);
  }

  await chatEditor.appendMessageBlocks(chat, ChatRole.User, [code]);
}
