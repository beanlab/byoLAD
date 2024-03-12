import * as vscode from "vscode";
import { ChatWebviewProvider } from "./ChatWebviewProvider";
import {
  ExtensionToWebviewMessageType,
  ExtensionToWebviewMessageTypeParamsMap,
  ExtensionToWebviewMessage,
  Chat,
  Persona,
} from "../../shared/types";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { PersonaDataManager } from "../Persona/PersonaDataManager";

export class ExtensionToWebviewMessageSender {
  private readonly chatWebviewProvider: ChatWebviewProvider;
  private readonly chatDataManager: ChatDataManager;
  private readonly personaDataManager: PersonaDataManager;

  public constructor(
    chatWebviewProvider: ChatWebviewProvider,
    chatDataManager: ChatDataManager,
    personaDataManager: PersonaDataManager,
  ) {
    this.chatWebviewProvider = chatWebviewProvider;
    this.chatDataManager = chatDataManager;
    this.personaDataManager = personaDataManager;
  }

  /**
   * Refreshes the webview to reflect the current state of the chat manager, including
   * the list of chats and the active chat.
   * Requests the webview to be shown.
   */
  public async refresh() {
    await this.chatWebviewProvider.show();
    const chats: Chat[] = this.chatDataManager.chats;
    let activeChatId: number | null = this.chatDataManager.activeChatId;
    if (activeChatId && !chats.find((chat) => chat.id === activeChatId)) {
      // activeChatId is invalid, so clear it
      this.chatDataManager.activeChatId = null;
      activeChatId = null;
    }
    const personas: Persona[] = this.personaDataManager.personas;
    const defaultPersonaId: number = this.personaDataManager.defaultPersonaId;

    const messageType: ExtensionToWebviewMessageType = "refresh";
    await this.postMessage({
      messageType: messageType,
      params: {
        chats: chats,
        activeChatId: activeChatId,
        personas: personas,
        defaultPersonaId: defaultPersonaId,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to display the chat/chatlist view.
   */
  public async showChatView() {
    await this.chatWebviewProvider.show();
    const messageType: ExtensionToWebviewMessageType = "showChatView";
    await this.postMessage({
      messageType: messageType,
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to display an error message. Shows error notification if the webview is not visible.
   * @param errorMessage The error message to display.
   */
  public async updateErrorMessage(errorMessage: string) {
    if (!this.chatWebviewProvider.isWebviewVisible) {
      vscode.window.showErrorMessage(errorMessage);
    } else {
      const messageType: ExtensionToWebviewMessageType = "errorMessage";
      await this.postMessage({
        messageType: messageType,
        params: {
          errorMessage: errorMessage,
        } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
      } as ExtensionToWebviewMessage);
    }
  }

  /**
   * Updates the webview to reflect whether or not a message is currently loading.
   * @param isLoading If the message is loading.
   */
  public async updateIsMessageLoading(isLoading: boolean) {
    const messageType: ExtensionToWebviewMessageType = "isMessageLoading";
    await this.postMessage({
      messageType: messageType,
      params: {
        isLoading: isLoading,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to reflect whether or not there is currently a selection in the editor.
   * @param hasSelection If something is currently selected in the editor.
   */
  public async updateHasSelection(hasSelection: boolean) {
    const messageType: ExtensionToWebviewMessageType = "hasSelection";
    await this.postMessage({
      messageType: messageType,
      params: {
        hasSelection: hasSelection,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Posts a message to the webview through the provider.
   * @param message The message to post.
   * @returns A boolean indicating whether the message was posted successfully (not if it was received successfully).
   */
  public async postMessage(
    message: ExtensionToWebviewMessage,
  ): Promise<boolean> {
    return await this.chatWebviewProvider.postMessage(message);
  }
}
