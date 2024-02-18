import { vscode } from "./vscode";
import {
  Chat,
  WebviewToExtensionMessage,
  WebviewToExtensionMessageTypeParamsMap,
  WebviewToExtensionMessageType,
} from "../../../shared/types";

/**
 * Sends messages to the extension context.
 */
export class ExtensionMessageSender {
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
   * Requests that all chats be sent back to the webview.
   */
  public getChats() {
    const messageType: WebviewToExtensionMessageType = "getChats";
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
}
