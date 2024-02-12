import { vscode } from "./vscode";
import { ChatMessage, Chat } from "./ChatModel";

/**
 * Sends messages to the extension context.
 */
export class ExtensionMessenger {
  static reviewCode() {
    vscode.postMessage({
      messageType: "reviewCode",
    });
  }

  static explainCode() {
    vscode.postMessage({
      messageType: "explainCode",
    });
  }

  static sendChatMessage(userInput: ChatMessage, useCodeReference: boolean) {
    vscode.postMessage({
      messageType: "sendChatMessage",
      params: {
        userInput: userInput,
        useCodeReference: useCodeReference,
      },
    });
  }

  static copyToClipboard(content: string): void {
    vscode.postMessage({
      messageType: "copyToClipboard",
      params: {
        content: content,
      },
    });
  }

  static diffClodeBlock(code: string) {
    vscode.postMessage({
      messageType: "diffCodeBlock",
      params: {
        code: code,
      },
    });
  }

  static insertCodeBlock(code: string) {
    vscode.postMessage({
      messageType: "insertCodeBlock",
      params: {
        code: code,
      },
    });
  }

  static deleteAllChats() {
    vscode.postMessage({
      messageType: "deleteAllChats",
    });
  }

  static deleteChat(chatId: number) {
    vscode.postMessage({
      messageType: "deleteChat",
      params: {
        chatId: chatId,
      },
    });
  }

  static newChat() {
    vscode.postMessage({
      messageType: "newChat",
    });
  }

  static getChats() {
    vscode.postMessage({
      messageType: "getChats",
    });
  }

  static setActiveChat(chat: Chat | null) {
    vscode.postMessage({
      messageType: "setActiveChat",
      params: {
        activeChatId: chat?.id || null,
      },
    });
  }

  static updateChat(chat: Chat) {
    vscode.postMessage({
      messageType: "updateChat",
      params: {
        chat: chat,
      },
    });
  }

  static addCodeToChat() {
    vscode.postMessage({
      messageType: "addCodeToChat",
    });
  }

  static getHasSelection() {
    vscode.postMessage({
      messageType: "getHasSelection",
    });
  }
}
