import { vscode } from "./vscode";
import { ChatMessage, CodeBlock, Conversation } from "./ChatModel";

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

  diffClodeBlock() {
    const demoCodeBlock = {
      content:
        "TODO: his is just a demo code block and is otherwise useless. This will actually need to use the code block the user has selected.",
    } as CodeBlock;
    vscode.postMessage({
      messageType: "diffCodeBlock",
      params: {
        codeBlock: demoCodeBlock,
      },
    });
  }

  deleteAllConversations() {
    vscode.postMessage({
      messageType: "deleteAllConversations",
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

  getCodeBlock(chatId: number) {
    vscode.postMessage({
      messageType: "getCodeBlock",
      params: {
        chatId: chatId,
      },
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
}
