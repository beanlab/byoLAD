import * as vscode from "vscode";

import { Chat, ChatRole } from "../../shared/types";
import { stringToMessageBlocks } from "../../shared/utils/messageBlockHelpers";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";
import {
  getFileContentAsCodeBlock,
  getSelectedTextAsCodeBlock,
} from "./getCodeBlock";
import { getCurrentOpenFileName } from "./getCurrentOpenFileName";

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
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  chatEditor: ChatEditor,
  chatDataManager: ChatDataManager,
  llmApiService: LLMApiService,
  chatWebviewProvider: ChatWebviewProvider,
) {
  const ifAlreadyVisible = chatWebviewProvider.isWebviewVisible();
  // Start a new chat if the webview is not visible or no active chat is provided
  if (!ifAlreadyVisible || !chat) {
    chat = chatDataManager.startChat();
  }

  // Include the markdown at the top of the message, first parsing it into message blocks
  const messageBlocks = stringToMessageBlocks(markdown);

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

  // if it is still the default title, then update the chat title
  if (chat.title == chatDataManager.DEFAULT_CHAT_NAME) {
    chat.title = markdown;
    chat.tags = [];
  }

  // if the file is a new file, add it to the tags
  const openedFileName = getCurrentOpenFileName();
  if (openedFileName !== undefined && !chat.tags.includes(openedFileName)) {
    chat.tags.push(openedFileName);
  }

  // Update UI immediately only if the webview is already visible
  const ifUpdateWebviewImmediately = ifAlreadyVisible;

  // Update the chat itself and (conditionally) the webview, and send the message to the LLM API
  await chatEditor.appendMessageBlocks(
    chat,
    ChatRole.User,
    messageBlocks,
    ifUpdateWebviewImmediately,
  );
  if (!ifAlreadyVisible) {
    await chatWebviewProvider.show();
  } else {
    await extensionToWebviewMessageSender.showChatView();
  }
  await llmApiService.requestLlmApiChatResponse(chat);
}
