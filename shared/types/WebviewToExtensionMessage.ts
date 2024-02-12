import { Chat, ChatMessage } from ".";

/**
 * Message sent from the webview to the extension context.
 */
export interface WebviewToExtensionMessage {
  messageType: WebviewToExtensionMessageType;
  params: WebviewToExtensionMessageTypeMap[keyof WebviewToExtensionMessageTypeMap];
}

/**
 * Type of message sent from the webview to the extension context.
 */
export type WebviewToExtensionMessageType =
  keyof WebviewToExtensionMessageTypeMap;

export interface WebviewToExtensionMessageTypeMap {
  reviewCode: null;
  explainCode: null;
  sendChatMessage: SendChatMessageMessageParams;
  copyToClipboard: CopyToClipboardMessageParams;
  diffCodeBlock: DiffCodeBlockParams;
  insertCodeBlock: InsertCodeBlockParams;
  deleteAllChats: null;
  deleteChat: DeleteChatParams;
  newChat: null;
  getChats: null;
  setActiveChat: SetActiveChatParams;
  updateChat: UpdateChatParams;
  addCodeToChat: null;
  getHasSelection: null;
}

export interface SendChatMessageMessageParams {
  /**
   * The message to send.
   */
  userInput: ChatMessage;
}

export interface CopyToClipboardMessageParams {
  /**
   * The content to copy to the clipboard.
   */
  content: string;
}

export interface DiffCodeBlockParams {
  /**
   * The code to diff.
   */
  code: string;
}

export interface InsertCodeBlockParams {
  /**
   * The code to insert.
   */
  code: string;
}

export interface DeleteChatParams {
  /**
   * The ID of the chat to delete.
   */
  chatId: number;
}

export interface SetActiveChatParams {
  /**
   * The ID of the chat to set as active, or null if no chat is active.
   */
  activeChatId: number | null;
}

export interface UpdateChatParams {
  /**
   * The chat to update.
   */
  chat: Chat;
}

// TO add a new WebviewToExtensionMessageType, add it to the WebviewToExtensionMessageTypeMap and export the params interface here.
