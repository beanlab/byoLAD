import * as vscode from "vscode";
import { ChatMessage } from "../ChatModel/ChatModel";

import { ConversationManager } from "../Conversation/ConversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndConversation } from "../helpers/ensureActiveWebviewAndConversation";

export const getSendChatMessageCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendChatMessage",
    async (chatMessage: ChatMessage) => {
      await ensureActiveWebviewAndConversation(
        conversationManager,
        chatWebviewProvider,
      );
      await sendChatMessage(
        chatMessage,
        settingsProvider,
        conversationManager,
        chatWebviewProvider,
      );
    },
  );
};
