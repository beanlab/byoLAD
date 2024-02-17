import * as vscode from "vscode";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";
import { ChatEditor } from "../Chat/ChatEditor";
import { ChatDataManager } from "../Chat/ChatDataManager";

/**
 * Command to add the selected code (or whole file if no selection) to the active chat.
 * Opens webview and/or starts chat if necessary.
 */

export const getAddCodeToChatCommand = (
  chatEditor: ChatEditor,
  chatDataManager: ChatDataManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.addCodeToChat", async () => {
    const chat = chatDataManager.getActiveChat();
    if (!chat) {
      vscode.window.showErrorMessage("No active chat"); // TODO: error handling?
      return;
    }
    await addSelectedCodeToChat(chat, chatEditor);
  });
