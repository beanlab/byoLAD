import { vscode } from "./vscode";
import { ChatMessage, Conversation } from "./ChatModel";

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

  deleteAllConversations() {
    vscode.postMessage({
      messageType: "deleteAllConversations",
    });
  }

  deleteConversation(conversationId: number) {
    vscode.postMessage({
      messageType: "deleteConversation",
      params: {
        conversationId: conversationId,
      },
    });
  }

  newConversation() {
    vscode.postMessage({
      messageType: "newConversation",
    });
  }

  getConversations() {
    vscode.postMessage({
      messageType: "getConversations",
    });
  }

  setActiveChat(conversation: Conversation | null) {
    vscode.postMessage({
      messageType: "setActiveChat",
      params: {
        activeConversationId: conversation?.id || null,
      },
    });
  }

  getByoladMessageIcon() {
    vscode.postMessage({
      messageType: "getByoladMessageIcon",
    });
  }

  updateChat(chat: Conversation) {
    vscode.postMessage({
      messageType: "updateChat",
      params: {
        chat: chat,
      },
    });
  }
}
