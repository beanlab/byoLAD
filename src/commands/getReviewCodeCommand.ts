import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatWebviewProvider";
import { insertMessage } from "../helpers/insertMessage";
import { TextBlock } from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";
/**
 * Command to review the selected code (or whole file if no selection) in a chat.
 * Sends the selection/file and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.reviewCode",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
        return;
      }

      const textBlock = {
        type: "text",
        content: settingsProvider.getReviewCodePrompt(),
      } as TextBlock;

      await ensureActiveWebviewAndChat(chatDataManager, chatWebviewProvider);
      const chat = chatDataManager.getActiveChat();
      if (!chat) {
        vscode.window.showErrorMessage("No active chat"); // TODO: error handling?
        return;
      }

      insertMessage(
        chat,
        textBlock,
        activeEditor,
        chatDataManager,
        chatWebviewProvider,
        chatEditor,
        llmApiService,
      );
    },
  );
};
