import * as vscode from "vscode";

import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { insertMessage } from "../helpers/insertMessage";
import { TextBlock } from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewMessageSender } from "../providers/ChatWebviewMessageSender";
/**
 * Command to review the selected code (or whole file if no selection) in a chat.
 * Sends the selection/file and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getReviewCodeCommand = (
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
  chatWebviewMessageSender: ChatWebviewMessageSender,
): vscode.Disposable =>
  vscode.commands.registerCommand("vscode-byolad.reviewCode", async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
      return;
    }

    const textBlock = {
      type: "text",
      content: settingsProvider.getReviewCodePrompt(),
    } as TextBlock;

    // TODO: New chat vs active chat vs selection vs messages already in vs all that

    // await ensureActiveWebviewAndChat(chatDataManager, chatWebviewProvider);
    // const chat = chatDataManager.startChat("asdf");
    const chat = chatDataManager.getActiveChat();
    // const chat = chatDataManager.getActiveChat();
    if (!chat) {
      vscode.window.showErrorMessage("No active chat"); // TODO: error handling?
      return;
    }

    insertMessage(
      chat,
      textBlock,
      activeEditor,
      chatEditor,
      llmApiService,
      chatWebviewMessageSender,
    );
  });
