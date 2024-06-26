import { Chat, ModelProvider, Persona, PersonaDraft } from "./";

// To add a new WebviewToExtensionMessageType, add it to the WebviewToExtensionMessageTypeParamsMap and export the params interface below.
// These messages are sent from the WebviewToExtensionMessageSender (webview) and handled by the WebviewToExtensionMessageHandler (extension).

/**
 * Message sent from the webview to the extension context.
 */
export interface WebviewToExtensionMessage {
  messageType: WebviewToExtensionMessageType;
  params: WebviewToExtensionMessageTypeParamsMap[WebviewToExtensionMessageType];
}

/**
 * Type of message sent from the webview to the extension context.
 */
export type WebviewToExtensionMessageType =
  keyof WebviewToExtensionMessageTypeParamsMap;

/**
 * Map of message types to their parameters.
 */
export interface WebviewToExtensionMessageTypeParamsMap {
  reviewCode: null;
  explainCode: null;
  sendChatMessage: SendChatMessageMessageParams;
  copyToClipboard: CopyToClipboardMessageParams;
  diffCodeBlock: DiffCodeBlockParams;
  insertCodeBlock: InsertCodeBlockParams;
  deleteAllChats: null;
  deleteChat: DeleteChatParams;
  newChat: null;
  requestRefresh: null;
  setActiveChat: SetActiveChatParams;
  updateChat: UpdateChatParams;
  addCodeToChat: null;
  getHasSelection: null;
  setDefaultPersonaId: SetDefaultPersonaIdParams;
  updatePersona: UpdatePersonaParams;
  deletePersona: DeletePersonaParams;
  manageApiKeys: ManageApiKeysParams;
  openExtensionVsCodeSettings: null;
  importPersona: null;
  exportPersona: ExportPersonaParams;
  // Add new message types here...
}

export interface SendChatMessageMessageParams {
  /**
   * Markdown content to send in the chat.
   */
  userMarkdown: string;
  chat: Chat;
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

export interface SetDefaultPersonaIdParams {
  /**
   * The ID of the persona to set as default.
   */
  personaId: number;
}

export interface UpdatePersonaParams {
  /**
   * The persona to update (add/edit).
   */
  persona: Persona | PersonaDraft;
}

export interface DeletePersonaParams {
  /**
   * The ID of the persona to delete.
   */
  personaId: number;
}

export interface ManageApiKeysParams {
  /**
   * The model provider to manage API keys for.
   * If undefined, the user will be prompted to select a model provider.
   */
  modelProvider: ModelProvider | undefined;
}

export interface ExportPersonaParams {
  /**
   * The ID of the persona to export.
   */
  personaId: number;
}
