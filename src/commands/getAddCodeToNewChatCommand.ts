import * as vscode from "vscode";

import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatEditor } from "../Chat/ChatEditor";
import { addCodeToChat } from "../helpers/addCodeToChat";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

export const getAddCodeToNewChatCommand = (
  chatDataManager: ChatDataManager,
  chatEditor: ChatEditor,
  chatWebviewProvider: ChatWebviewProvider,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToNewChat",
    async () => {
      const chat = chatDataManager.startChat();
      await addCodeToChat(chat, chatEditor);
      await chatWebviewProvider.show();
      await extensionToWebviewMessageSender.showChatView();
    },
  );
