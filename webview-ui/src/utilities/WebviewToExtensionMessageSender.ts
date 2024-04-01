import {
  Chat,
  ModelProvider,
  Persona,
  PersonaDraft,
  WebviewToExtensionMessage,
  WebviewToExtensionMessageType,
  WebviewToExtensionMessageTypeParamsMap,
} from "../../../shared/types";
import { vscode } from "./vscode";

/**
 * Sends messages to the extension context.
 */
export class WebviewToExtensionMessageSender {
  /**
   * Triggers a review of the code.
   */
  public reviewCode() {
    const messageType: WebviewToExtensionMessageType = "reviewCode";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Triggers an explanation of the code.
   */
  public explainCode() {
    const messageType: WebviewToExtensionMessageType = "explainCode";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Sends a chat message to the extension context to be sent to the LLM.
   * @param userInput The message to send.
   */
  public sendChatMessage(userInput: string, chat: Chat) {
    const messageType: WebviewToExtensionMessageType = "sendChatMessage";
    vscode.postMessage({
      messageType: messageType,
      params: {
        userMarkdown: userInput,
        chat: chat,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the content be copied to the clipboard.
   * @param content The content to copy to the clipboard.
   */
  public copyToClipboard(content: string): void {
    const messageType: WebviewToExtensionMessageType = "copyToClipboard";
    vscode.postMessage({
      messageType: messageType,
      params: {
        content: content,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the code be displayed in a diff view.
   * @param code The code to diff.
   */
  public diffCodeBlock(code: string) {
    const messageType: WebviewToExtensionMessageType = "diffCodeBlock";
    vscode.postMessage({
      messageType: messageType,
      params: {
        code: code,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the code be inserted into the chat.
   * @param code The code to insert.
   */
  public insertCodeBlock(code: string) {
    const messageType: WebviewToExtensionMessageType = "insertCodeBlock";
    vscode.postMessage({
      messageType: messageType,
      params: {
        code: code,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that all chats be deleted.
   */
  public deleteAllChats() {
    const messageType: WebviewToExtensionMessageType = "deleteAllChats";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that a chat be deleted.
   * @param chatId The ID of the chat to delete.
   */
  public deleteChat(chatId: number) {
    const messageType: WebviewToExtensionMessageType = "deleteChat";
    vscode.postMessage({
      messageType: messageType,
      params: {
        chatId: chatId,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that a new chat be created.
   */
  public newChat() {
    const messageType: WebviewToExtensionMessageType = "newChat";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests a refresh of the extension data.
   */
  public requestRefresh() {
    const messageType: WebviewToExtensionMessageType = "requestRefresh";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Sets the active chat in the extension context storage.
   * @param chat The chat to set as active.
   */
  public setActiveChat(chat: Chat | null) {
    const messageType: WebviewToExtensionMessageType = "setActiveChat";
    vscode.postMessage({
      messageType: messageType,
      params: {
        activeChatId: chat?.id || null,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Updates a chat in the extension context storage.
   * @param chat The chat to update.
   */
  public updateChat(chat: Chat) {
    const messageType: WebviewToExtensionMessageType = "updateChat";
    vscode.postMessage({
      messageType: messageType,
      params: {
        chat: chat,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Adds code to the chat.
   */
  public addCodeToChat() {
    const messageType: WebviewToExtensionMessageType = "addCodeToChat";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests whether there is a selection in the editor to be sent back to the webview.
   */
  public getHasSelection() {
    const messageType: WebviewToExtensionMessageType = "getHasSelection";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the default persona ID be set.
   * @param personaId The ID of the persona to set as default.
   */
  public setDefaultPersonaId(personaId: number) {
    const messageType: WebviewToExtensionMessageType = "setDefaultPersonaId";
    vscode.postMessage({
      messageType: messageType,
      params: {
        personaId: personaId,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that a persona be updated (add/edit).
   * @param persona The persona to update.
   */
  public updatePersona(persona: Persona | PersonaDraft) {
    const messageType: WebviewToExtensionMessageType = "updatePersona";
    vscode.postMessage({
      messageType: messageType,
      params: {
        persona: persona,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that a persona be deleted.
   * @param personaId The ID of the persona to delete.
   */
  public deletePersona(personaId: number) {
    const messageType: WebviewToExtensionMessageType = "deletePersona";
    vscode.postMessage({
      messageType: messageType,
      params: {
        personaId: personaId,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the API key management options be opened.
   * @param modelProvider The model provider to manage the API keys for. If undefined, the user will be prompted to select a model provider.
   */
  public manageApiKeys(modelProvider: ModelProvider | undefined) {
    const messageType: WebviewToExtensionMessageType = "manageApiKeys";
    vscode.postMessage({
      messageType: messageType,
      params: {
        modelProvider: modelProvider,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the extension settings be opened.
   */
  public openExtensionVsCodeSettings() {
    const messageType: WebviewToExtensionMessageType =
      "openExtensionVsCodeSettings";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that the perosona import flow be initiated.
   */
  public importPersona() {
    const messageType: WebviewToExtensionMessageType = "importPersona";
    vscode.postMessage({
      messageType: messageType,
    } as WebviewToExtensionMessage);
  }

  /**
   * Requests that a persona be exported.
   * @param personaId The ID of the persona to export.
   */
  public exportPersona(personaId: number) {
    const messageType: WebviewToExtensionMessageType = "exportPersona";
    vscode.postMessage({
      messageType: messageType,
      params: {
        personaId: personaId,
      } as WebviewToExtensionMessageTypeParamsMap[typeof messageType],
    } as WebviewToExtensionMessage);
  }
}
