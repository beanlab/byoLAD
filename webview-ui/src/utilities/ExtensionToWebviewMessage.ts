import { CodeBlock, Conversation } from "./ChatModel";

export interface ExtensionToWebviewMessage {
  messageType: string;
  params: ExtensionToWebviewMessageParams;
}

export interface ExtensionToWebviewMessageParams {}

export interface RefreshChatMessageParams {
  activeConversation?: Conversation;
}

export interface UpdateConversationMessageParams {
  conversations: Conversation[];
  activeConversation?: Conversation;
}

export interface AddCodeBlockMessageParams {
  codeBlock: CodeBlock;
}
