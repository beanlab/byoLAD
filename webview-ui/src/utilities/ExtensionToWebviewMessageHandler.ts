import {
  Chat,
  ExtensionToWebviewMessage,
  ExtensionToWebviewMessageTypeParamsMap,
  Persona,
} from "../../../shared/types";

export class ExtensionToWebviewMessageHandler {
  private setChatList: (chatList: Chat[] | undefined) => void;
  private setPersonas: (personaList: Persona[] | undefined) => void;
  private setActiveChat: (activeChat: Chat | null) => void;
  private setLoadingMessage: (isLoading: boolean) => void;
  private setErrorMessage: (errorMessage: string | null) => void;
  private setHasSelection: (hasSelection: boolean) => void;

  constructor(
    setChatList: (chatList: Chat[] | undefined) => void,
    setPersonaList: (personaList: Persona[] | undefined) => void,
    setActiveChat: (activeChat: Chat | null) => void,
    setLoadingMessage: (isLoading: boolean) => void,
    setErrorMessage: (errorMessage: string | null) => void,
    setHasSelection: (hasSelection: boolean) => void,
  ) {
    this.setChatList = setChatList;
    this.setPersonas = setPersonaList;
    this.setActiveChat = setActiveChat;
    this.setLoadingMessage = setLoadingMessage;
    this.setErrorMessage = setErrorMessage;
    this.setHasSelection = setHasSelection;
  }

  public async handleMessage(message: ExtensionToWebviewMessage) {
    switch (message.messageType) {
      case "isMessageLoading": {
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setLoadingMessage(params.isLoading);
        break;
      }
      case "refresh": {
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setChatList(params.chats);
        this.setPersonas(params.personas);
        const newActiveChat: Chat | null =
          params.chats.find((chat) => chat.id === params.activeChatId) || null;
        this.setActiveChat(newActiveChat);
        break;
      }
      case "errorMessage": {
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setLoadingMessage(false);
        this.setErrorMessage(params.errorMessage);
        break;
      }
      case "hasSelection": {
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setHasSelection(params.hasSelection);
        break;
      }
      default: {
        // Ensure exhaustive switch. Make sure all message types are handled in the switch statement.
        const _exhaustiveCheck: never = message.messageType;
        throw new Error(`Unknown message type: ${_exhaustiveCheck}`);
      }
    }
  }
}
