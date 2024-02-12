import { Chat } from ".";

/**
 * The message sent from the extension to the webview
 */
export interface ExtensionToWebviewMessage {
  messageType: MessageType;
  params: MessageTypeParamsMap[MessageType];
}

/**
 * Type of message sent from the extension to the webview
 */
export type MessageType = keyof MessageTypeParamsMap;

/**
 * Map of message types to their respective parameters.
 * Ex) An ExtensionToWebviewMessage with messageType: "refresh" will have params of type RefreshMessageParams
 */
export interface MessageTypeParamsMap {
  refresh: RefreshMessageParams;
  errorMessage: ErrorMessageParams;
  isMessageLoading: IsMessageLoadingParams;
  hasSelection: HasSelectionParams;
  // Add new message types here...
}

export interface RefreshMessageParams {
  /**
   * All Chats
   */
  chats: Chat[];
  /**
   * ID of the active chat, or null if no chat is active
   */
  activeChatId: number | null;
}

export interface ErrorMessageParams {
  /**
   * Error message to display
   */
  errorMessage: string;
}

export interface IsMessageLoadingParams {
  /**
   * If the message is loading
   */
  isLoading: boolean;
}

export interface HasSelectionParams {
  /**
   * If something is currently selected in the editor
   */
  hasSelection: boolean;
}

// To add a new MessageType, add it to the MessageTypeParamsMap and export the Params here
