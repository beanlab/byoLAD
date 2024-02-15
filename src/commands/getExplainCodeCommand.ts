import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { insertMessage } from "../helpers/insertMessage";
import { TextBlock } from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

/**
 * Command to explain the selected code (or whole file if no selection) in a chat.
 * Sends the selection and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
) =>
  vscode.commands.registerCommand("vscode-byolad.explainCode", async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }
    // TODO: refactor these whole command things

    const textBlock = {
      type: "text",
      content: settingsProvider.getExplainCodePrompt(),
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
  });
