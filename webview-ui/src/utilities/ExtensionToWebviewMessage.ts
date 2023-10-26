import { Conversation } from "./ChatModel";

export interface ExtensionToWebviewMessage {
  messageType: string;
  params: ExtensionToWebviewMessageParams;
}

export interface ExtensionToWebviewMessageParams {}

export interface RefreshChatMessageParams {
  activeConversation: Conversation;
}
