import * as vscode from "vscode";
import {
  ChatMessage,
  ChatModelResponse,
  ChatRole,
} from "../ChatModel/ChatModel";
import { Conversation } from "../ChatModel/ChatModel";
import { SettingsProvider } from "./SettingsProvider";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export async function sendChatMessage(
  chatMessage: ChatMessage,
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  const conversation = conversationManager.getActiveConversation();
  if (!conversation) {
    vscode.window.showErrorMessage("No active conversation");
    return;
  }

  if (
    conversation.messages.length === 0 ||
    conversation.messages[conversation.messages.length - 1].role !==
      ChatRole.User
  ) {
    conversation.messages.push(chatMessage);
  } else {
    conversation.messages[conversation.messages.length - 1] = chatMessage;
  }

  try {
    const response: ChatModelResponse = await settingsProvider
      .getChatModel()
      .chat({
        conversation,
      });
    if (response.success && response.message) {
      handleSuccessfulResponse(
        response.message,
        conversation,
        conversationManager,
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
 * Handle a successful response from the chat model. Update the conversation and the side panel.
 *
 * @param responseMessage Response message from the chat model
 * @param conversation Conversation to update
 * @param conversationManager Conversation manager
 * @param chatWebviewProvider Current side panel
 */
function handleSuccessfulResponse(
  responseMessage: ChatMessage,
  conversation: Conversation,
  conversationManager: ConversationManager,
  chatWebviewProvider: ChatWebviewProvider,
): void {
  conversation.messages.push(responseMessage);
  conversationManager.updateConversation(conversation);
  chatWebviewProvider.updateConversation(
    conversationManager.conversations,
    conversation.id,
  );
}

/**
 * Handle a failed response from the chat model. Show an error message on the side panel with no change to the conversation.
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
