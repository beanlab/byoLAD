import * as vscode from "vscode";
import { ChatMessage } from "../ChatModel/ChatModel";

import { ChatManager } from "../Chat/ChatManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

export const getSendChatMessageCommand = (
  settingsProvider: SettingsProvider,
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendChatMessage",
    async (chatMessage: ChatMessage) => {
      await ensureActiveWebviewAndChat(chatManager, chatWebviewProvider);
      await sendChatMessage(
        chatMessage,
        settingsProvider,
        chatManager,
        chatWebviewProvider,
      );
    },
  );
};
