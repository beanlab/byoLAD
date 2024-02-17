import * as vscode from "vscode";
import { getCodeReference } from "./getCodeReference";
import { Chat, ChatRole, CodeBlock, MessageBlock } from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";

export async function addSelectedCodeToChat(
  chat: Chat,
  chatEditor: ChatEditor,
) {
  if (chat) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const codeBlock = getCodeReference(activeEditor) as CodeBlock | null;
      if (codeBlock) {
        await chatEditor.appendMessageBlocks(chat, ChatRole.User, [
          codeBlock,
        ] as MessageBlock[]);
      }
    }
  }
}
// TODO: Docs and error handling
