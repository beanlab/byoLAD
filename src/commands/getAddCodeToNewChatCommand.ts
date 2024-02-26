import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatEditor } from "../Chat/ChatEditor";
import { addCodeToChat } from "../helpers/addCodeToChat";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";

export const getAddCodeToNewChatCommand = (
  chatDataManager: ChatDataManager,
  chatEditor: ChatEditor,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToNewChat",
    async () => {
      await chatWebviewProvider.show();
      const chat = chatDataManager.startChat();
      await addCodeToChat(chat, chatEditor);
    },
  );
