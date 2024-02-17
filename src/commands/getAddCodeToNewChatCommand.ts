import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";
import { ChatEditor } from "../Chat/ChatEditor";

export const getAddCodeToNewChatCommand = (
  chatDataManager: ChatDataManager,
  chatEditor: ChatEditor,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToNewChat",
    async () => {
      const chat = chatDataManager.startChat("Code Chat"); // TODO: How to name?
      await addSelectedCodeToChat(chat, chatEditor);
      await vscode.commands.executeCommand("vscode-byolad.chat.focus");
    },
  );
