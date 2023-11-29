import * as vscode from "vscode";
import { ChatMessage } from "../ChatModel/ChatModel";

import { ConversationManager } from "../Conversation/ConversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getSendChatMessageCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  currentPanel: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendChatMessage",
    async (chatMessage: ChatMessage) => {
      await sendChatMessage(
        chatMessage,
        settingsProvider,
        conversationManager,
        currentPanel,
      );
    },
  );
};
