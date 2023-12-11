import { CodeBlock, Conversation } from "./ChatModel";

export interface ExtensionToWebviewMessage {
  messageType: string;
  params: ExtensionToWebviewMessageParams;
}

export interface ExtensionToWebviewMessageParams {}

export interface UpdateConversationMessageParams {
  conversations: Conversation[];
  activeConversationId?: number;
}

export interface UpdateConversationListMessageParams {
  conversations: Conversation[];
}

export interface AddCodeBlockMessageParams {
  codeBlock: CodeBlock;
}
