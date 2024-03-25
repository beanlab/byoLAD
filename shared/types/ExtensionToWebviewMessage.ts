import { Chat, Persona } from ".";

// To add a new ExtensionToWebviewMessageType, add it to the ExtensionToWebviewMessageTypeParamsMap and export the params interface below.
// These messages are sent from the ExtensionToWebviewMessageSender (extension) and handled by the ExtensionToWebviewMessageHandler (webview).

/**
 * Message sent from the extension context to the webview.
 */
export interface ExtensionToWebviewMessage {
  messageType: ExtensionToWebviewMessageType;
  params: ExtensionToWebviewMessageTypeParamsMap[ExtensionToWebviewMessageType];
}

/**
 * Type of message sent from the extension context to the webview.
 */
export type ExtensionToWebviewMessageType =
  keyof ExtensionToWebviewMessageTypeParamsMap;

/**
 * Map of message types to their respective parameters.
 * Ex) An ExtensionToWebviewMessage with messageType: "refresh" will have params of type RefreshMessageParams
 */
export interface ExtensionToWebviewMessageTypeParamsMap {
  refresh: RefreshMessageParams;
  errorMessage: ErrorMessageParams;
  isMessageLoading: IsMessageLoadingParams;
  hasSelection: HasSelectionParams;
  showChatView: null;
  // Add new message types here...
}

export interface RefreshMessageParams {
  /**
   * All Chats.
   */
  chats: Chat[];
  /**
   * ID of the active chat, or null if no chat is active.
   */
  activeChatId: number | null;
  /**
   * All Personas.
   */
  personas: Persona[];
  /**
   * ID of the default persona.
   */
  defaultPersonaId: number;
}

export interface ErrorMessageParams {
  /**
   * Error message to display.
   */
  errorMessage: string;
}

export interface IsMessageLoadingParams {
  /**
   * If the message is loading.
   */
  isLoading: boolean;
}

export interface HasSelectionParams {
  /**
   * If something is currently selected in the editor.
   */
  hasSelection: boolean;
}
