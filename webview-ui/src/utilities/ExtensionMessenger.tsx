import { vscode } from "./vscode";
import { ChatMessage, Chat } from "./ChatModel";
import { Persona } from "../../../src/Chat/PersonaManager";

/**
 * Sends messages to the extension context.
 */
export class ExtensionMessenger {
  reviewCode() {
    vscode.postMessage({
      messageType: "reviewCode",
    });
  }

  explainCode() {
    vscode.postMessage({
      messageType: "explainCode",
    });
  }

  sendChatMessage(userInput: ChatMessage, useCodeReference: boolean) {
    vscode.postMessage({
      messageType: "sendChatMessage",
      params: {
        userInput: userInput,
        useCodeReference: useCodeReference,
      },
    });
  }

  copyToClipboard(content: string): void {
    vscode.postMessage({
      messageType: "copyToClipboard",
      params: {
        content: content,
      },
    });
  }

  diffClodeBlock(code: string) {
    vscode.postMessage({
      messageType: "diffCodeBlock",
      params: {
        code: code,
      },
    });
  }

  insertCodeBlock(code: string) {
    vscode.postMessage({
      messageType: "insertCodeBlock",
      params: {
        code: code,
      },
    });
  }

  deleteAllChats() {
    vscode.postMessage({
      messageType: "deleteAllChats",
    });
  }

  deleteChat(chatId: number) {
    vscode.postMessage({
      messageType: "deleteChat",
      params: {
        chatId: chatId,
      },
    });
  }

  newChat() {
    vscode.postMessage({
      messageType: "newChat",
    });
  }

  getChats() {
    vscode.postMessage({
      messageType: "getChats",
    });
  }

  setActiveChat(chat: Chat | null) {
    vscode.postMessage({
      messageType: "setActiveChat",
      params: {
        activeChatId: chat?.id || null,
      },
    });
  }

  getByoladMessageIcon() {
    vscode.postMessage({
      messageType: "getByoladMessageIcon",
    });
  }

  updateChat(chat: Chat) {
    vscode.postMessage({
      messageType: "updateChat",
      params: {
        chat: chat,
      },
    });
  }

  setActivePersona(persona: Persona) {
    vscode.postMessage({
      messageType: "setActivePersona",
      params: {
        persona
      }
    })
  }

  getPersonaList() {
    vscode.postMessage({
      messageType: "getPersonaList"
    })
  }
}
