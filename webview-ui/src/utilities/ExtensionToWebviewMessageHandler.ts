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
  private setDefaultPersonaId: (defaultPersonaId: number) => void;
  private setLoadingMessage: (isLoading: boolean) => void;
  private setErrorMessage: (errorMessage: string | null) => void;
  private setHasSelection: (hasSelection: boolean) => void;
  private setActiveViewAsChat: (chat: Chat) => void;
  private setActiveViewAsChatList: () => void;

  constructor(
    setChatList: (chatList: Chat[] | undefined) => void,
    setPersonaList: (personaList: Persona[] | undefined) => void,
    setActiveChat: (activeChat: Chat | null) => void,
    setDefaultPersonaId: (defaultPersonaId: number) => void,
    setLoadingMessage: (isLoading: boolean) => void,
    setErrorMessage: (errorMessage: string | null) => void,
    setHasSelection: (hasSelection: boolean) => void,
    setActiveViewAsChat: (chat: Chat) => void,
    setActiveViewAsChatList: () => void,
  ) {
    this.setChatList = setChatList;
    this.setPersonas = setPersonaList;
    this.setActiveChat = setActiveChat;
    this.setDefaultPersonaId = setDefaultPersonaId;
    this.setLoadingMessage = setLoadingMessage;
    this.setErrorMessage = setErrorMessage;
    this.setHasSelection = setHasSelection;
    this.setActiveViewAsChat = setActiveViewAsChat;
    this.setActiveViewAsChatList = setActiveViewAsChatList;
  }

  public async handleMessage(message: ExtensionToWebviewMessage) {
    console.log("Handling message: ", message);
    switch (message.messageType) {
      case "isMessageLoading": {
        console.log("handling `isMessageLoading` message: ", message.params);
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setLoadingMessage(params.isLoading);
        break;
      }
      case "refresh": {
        console.log("handling `refresh` message: ", message.params);
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setChatList(params.chats);
        this.setPersonas(params.personas);
        this.setDefaultPersonaId(params.defaultPersonaId);
        const newActiveChat: Chat | null =
          params.chats.find((chat) => chat.id === params.activeChatId) || null;
        console.log("Foud active chat...?", newActiveChat);
        this.setActiveChat(newActiveChat);
        console.log(
          "In 'refresh' handler: about to call setActiveViewAsChat/List()!",
        );
        if (newActiveChat) {
          this.setActiveViewAsChat(newActiveChat);
        } else {
          this.setActiveViewAsChatList();
        }
        console.log("In 'refresh' handler: called setActiveViewAsChat/List!");
        break;
      }
      case "errorMessage": {
        console.log("handling `errorMessage` message: ", message.params);
        const params =
          message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
        this.setLoadingMessage(false);
        this.setErrorMessage(params.errorMessage);
        break;
      }
      case "hasSelection": {
        console.log("handling `hasSelection` message: ", message.params);
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
