import * as vscode from "vscode";
import {
  ChatMessage,
  ChatModelResponse,
  ChatRole,
  CodeBlock,
  TextBlock,
} from "../ChatModel/ChatModel";
import { Conversation } from "../Conversation/conversation";
import { ConversationManager } from "../Conversation/conversationManager";
import { outputConversationHtml } from "../Conversation/outputConversationHtml";
import { SettingsProvider } from "./SettingsProvider";

export async function sendMessage(
  messageText: TextBlock,
  codeReference: CodeBlock | null,
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
) {
  const conversation = conversationManager.getActiveConversation();
  if (!conversation) {
    vscode.window.showErrorMessage("No active conversation"); // TODO: How to handle?
    return;
  }

  // TODO: I think this actually modifies the conversation as stored in the workspace state. Is that a problem?
  conversation.messages.push({
    role: ChatRole.User,
    content: codeReference ? [messageText, codeReference] : [messageText],
  } as ChatMessage);

  let response: ChatModelResponse;
  // TODO: Use a loading/typing indicator of sorts in the side panel instead of notification progress bar
  vscode.window
    .withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: "Sending message...", // TODO: make this a constant
      },
      async () => {
        response = await settingsProvider.getChatModel().chat({
          conversation,
        });
      }
    )
    .then(async () => {
      if (response.success && response.message) {
        handleSuccessfulResponse(
          response.message,
          conversation,
          conversationManager
        );
      } else {
        handleErrorResponse(response, conversation, conversationManager);
      }
    });
}

/**
 * TODO: Incorporate webview
 *
 * @param responseMessage
 * @param conversation
 * @param conversationManager
 */
function handleSuccessfulResponse(
  responseMessage: ChatMessage,
  conversation: Conversation,
  conversationManager: ConversationManager
): void {
  vscode.window.showInformationMessage("Successful response!"); // TODO: DELETE ME
  conversation.messages.push(responseMessage);
  conversationManager.updateConversation(conversation);
  outputConversationHtml(conversationManager); // TODO: Change to updating the webview instead
}

/**
 * TODO: How to handle all of these? Probably depends on how the webview sidepanel is implemented.
 *
 * @param response
 * @param conversation
 * @param conversationManager
 */
function handleErrorResponse(
  response: ChatModelResponse,
  conversation: Conversation,
  conversationManager: ConversationManager
): void {
  if (!response.success) {
    if (response.errorMessage) {
      vscode.window.showErrorMessage(`Error: ${response.errorMessage}`);
    } else {
      vscode.window.showErrorMessage("Unknown error");
    }
  } else if (!response.message) {
    vscode.window.showErrorMessage(
      "Response marked successful, but no message was returned"
    );
  } else {
    vscode.window.showErrorMessage("Unknown error");
  }
}
