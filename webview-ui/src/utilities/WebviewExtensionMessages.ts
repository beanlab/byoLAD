import { Conversation } from "./ChatModel";

/**
 * The types of messages that can be sent from the webview view context.
 * These must be coordinated with the webview view context.
 * // TODO: Is there a way to share these types between the webview view context and the extension without duplicating them?
 */
export interface WebviewToExtensionMessage {
  command: string;
}

export interface NewConversationRequest extends WebviewToExtensionMessage {
  command: "newConversation";
}

export interface ClearConversationsRequest extends WebviewToExtensionMessage {
  command: "clearConversations";
}

export interface ReviewCodeRequest extends WebviewToExtensionMessage {
  command: "reviewCode";
}

export interface ExplainCodeRequest extends WebviewToExtensionMessage {
  command: "explainCode";
}

export interface SendMessageRequest extends WebviewToExtensionMessage {
  command: "sendMessage";
  userInput: string;
  useCodeReference: boolean;
}

export interface ExtensionToWebviewMessage {
  command: string;
}

export interface RefreshChatRequest extends ExtensionToWebviewMessage {
  command: "refreshChat";
  conversation: Conversation;
}

export {};
