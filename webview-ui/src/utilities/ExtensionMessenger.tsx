import { vscode } from "./vscode";
import { CodeBlock } from "./ChatModel";

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

  sendChatMessage(userInput: string, useCodeReference: boolean) {
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
}
