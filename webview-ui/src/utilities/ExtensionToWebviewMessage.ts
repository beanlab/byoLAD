import { CodeBlock, Chat } from "./ChatModel";

export interface ExtensionToWebviewMessage {
  messageType: string;
  params: ExtensionToWebviewMessageParams;
}

export interface ExtensionToWebviewMessageParams {}

export interface UpdateChatMessageParams {
  chats: Chat[];
  activeChatId?: number;
}

export interface UpdateChatListMessageParams {
  chats: Chat[];
}

export interface AddCodeBlockMessageParams {
  codeBlock: CodeBlock;
}

export interface ErrorResponseMessageParams {
  errorMessage: string;
}

export interface UpdateHasSelectionMessageParams {
  hasSelection: boolean;
}
