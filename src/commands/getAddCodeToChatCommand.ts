import * as vscode from "vscode";
import { ChatEditor } from "../Chat/ChatEditor";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { addCodeToChat } from "../helpers/addCodeToChat";

export const getAddCodeToChatCommand = (
  chatEditor: ChatEditor,
  chatDataManager: ChatDataManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.addCodeToChat", async () => {
    const chat = chatDataManager.getActiveChat();
    if (!chat) {
      vscode.window.showErrorMessage("No active chat");
      return;
    }
    await addCodeToChat(chat, chatEditor);
  });
