import * as vscode from "vscode";
import { ChatMessage } from "../../shared/types";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

/**
 * Command to send the given chat message to the active chat.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getSendChatMessageCommand = (
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendChatMessage",
    async (chatMessage: ChatMessage) => {
      await ensureActiveWebviewAndChat(chatDataManager, chatWebviewProvider);
      await sendChatMessage(
        chatMessage,
        settingsProvider,
        chatDataManager,
        chatWebviewProvider,
      );
    },
  );
};
