import * as vscode from "vscode";
import { Chat, ChatRole, MessageBlock, TextBlock } from "../../shared/types";
import {
  getFileContentAsCodeBlock,
  getSelectedTextAsCodeBlock,
} from "./getCodeReference";
import { ChatWebviewMessageSender } from "../webview/ChatWebviewMessageSender";
import { ChatEditor } from "../Chat/ChatEditor";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";

/**
 * Primary function to send a chat message. Starts a new chat if needed,
 * includes the markdown and code from the editor (if desired), and sends the message to
 * the LLM API. Updating the webview and chat data storage accordingly. If the webview
 * is not open, it's opened and a new chat is started.
 * @param chat Chat to send the message to, or null to start a new chat.
 * @param markdown Markdown to include at the top of the message.
 * @param includeCodeFromEditor Whether to include the selected code (or whole code file if nothing selected) from the editor.
 */
export async function sendChatMessage(
  chat: Chat | null,
  markdown: string,
  includeCodeFromEditor: boolean,
  chatWebviewMessageSender: ChatWebviewMessageSender,
  chatEditor: ChatEditor,
  chatDataManager: ChatDataManager,
  llmApiService: LLMApiService,
  chatWebviewProvider: ChatWebviewProvider,
) {
  // Open the webview if needed and start a new chat
  if (!chatWebviewProvider.isWebviewVisible()) {
    await chatWebviewProvider.show();
    chat = chatDataManager.startChat("New Chat"); // TODO: How to name?
  }

  // Start a new chat if needed
  if (!chat) {
    chat = chatDataManager.startChat("New Chat"); // TODO: How to name?
  }

  // Include the markdown at the top of the message
  const messageBlocks: MessageBlock[] = [
    {
      type: "text",
      content: markdown,
    } as TextBlock,
  ];

  // Include the selected code (or whole code file) from the editor if desired
  if (includeCodeFromEditor) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }

    let codeBlock = getSelectedTextAsCodeBlock(activeEditor);
    if (!codeBlock) {
      codeBlock = getFileContentAsCodeBlock(activeEditor);
    }
    messageBlocks.push(codeBlock);
  }

  // Update the webview, chat itself, and send the message to the LLM API
  await chatWebviewMessageSender.updateIsMessageLoading(true);
  await chatEditor.appendMessageBlocks(chat, ChatRole.User, messageBlocks);
  await llmApiService.requestLlmApiChatResponse(chat);
}
