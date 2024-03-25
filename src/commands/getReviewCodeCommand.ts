import * as vscode from "vscode";

import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

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
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  chatWebviewProvider: ChatWebviewProvider,
): vscode.Disposable =>
  vscode.commands.registerCommand("vscode-byolad.reviewCode", async () => {
    const prompt = settingsProvider.getReviewCodePrompt();
    const includeCodeFromEditor = true;
    await sendChatMessage(
      chatDataManager.getActiveChat(),
      prompt,
      includeCodeFromEditor,
      extensionToWebviewMessageSender,
      chatEditor,
      chatDataManager,
      llmApiService,
      chatWebviewProvider,
    );
    await extensionToWebviewMessageSender.showChatView();
  });
