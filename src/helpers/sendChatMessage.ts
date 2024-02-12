import * as vscode from "vscode";
import {
  ChatMessage,
  ChatModelResponse,
  ChatRole,
} from "../ChatModel/ChatModel";
import { Chat } from "../ChatModel/ChatModel";
import { SettingsProvider } from "./SettingsProvider";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

/**
 * Sends the given chat message to the chat model and updates the chat and side panel accordingly.
 */
export async function sendChatMessage(
  chatMessage: ChatMessage,
  settingsProvider: SettingsProvider,
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  const chat = chatManager.getActiveChat();
  if (!chat) {
    vscode.window.showErrorMessage("No active chat");
    return;
  }

  if (
    chat.messages.length === 0 ||
    chat.messages[chat.messages.length - 1].role !== ChatRole.User
  ) {
    chat.messages.push(chatMessage);
  } else {
    chat.messages[chat.messages.length - 1] = chatMessage;
  }

  try {
    const response: ChatModelResponse = await settingsProvider
      .getChatModel()
      .chat({
        chat,
      });
    if (response.success && response.message) {
      handleSuccessfulResponse(
        response.message,
        chat,
        chatManager,
        chatWebviewProvider,
      );
    } else {
      handleErrorResponse(response, chatWebviewProvider);
    }
  } catch (error) {
    chatWebviewProvider.showErrorMessage(`Unexpected error: ${error}`);
  }
}

/**
 * Handle a successful response from the chat model. Update the chat and the side panel.
 *
 * @param responseMessage Response message from the chat model
 * @param chat Chat to update
 * @param chatManager Chat manager
 * @param chatWebviewProvider Current side panel
 */
function handleSuccessfulResponse(
  responseMessage: ChatMessage,
  chat: Chat,
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
): void {
  chat.messages.push(responseMessage);
  chatManager.updateChat(chat);
  chatWebviewProvider.refresh();
  chatWebviewProvider.setLoading(false);
}

/**
 * Handle a failed response from the chat model. Show an error message on the side panel with no change to the chat.
 *
 * @param response Response from the chat model
 * @param chatWebviewProvider Current side panel
 */
function handleErrorResponse(
  response: ChatModelResponse,
  chatWebviewProvider: ChatWebviewProvider,
): void {
  if (!response.success) {
    if (response.errorMessage) {
      chatWebviewProvider.showErrorMessage(`Error: ${response.errorMessage}`);
    } else {
      chatWebviewProvider.showErrorMessage("Unknown error");
    }
  } else if (!response.message) {
    chatWebviewProvider.showErrorMessage(
      "Response marked successful, but no message was returned",
    );
  } else {
    chatWebviewProvider.showErrorMessage("Unknown error");
  }
}
