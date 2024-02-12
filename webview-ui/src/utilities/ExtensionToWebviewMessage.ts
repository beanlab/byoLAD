import { Chat } from "./ChatModel";

export interface ExtensionToWebviewMessage {
  messageType: string;
  params: ExtensionToWebviewMessageParams;
}

export interface ExtensionToWebviewMessageParams {}

export interface RefreshMessageParams extends ExtensionToWebviewMessageParams {
  chats: Chat[];
  activeChatId: number | null;
}
export interface ErrorResponseMessageParams
  extends ExtensionToWebviewMessageParams {
  errorMessage: string;
}

export interface SetLoadingParams extends ExtensionToWebviewMessageParams {
  loading: boolean;
}

export interface UpdateHasSelectionMessageParams
  extends ExtensionToWebviewMessageParams {
  hasSelection: boolean;
}
