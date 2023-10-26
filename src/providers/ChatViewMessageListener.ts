import * as vscode from "vscode";

export class ChatViewMessageListener {
  constructor() {}

  /**
   * Handles messages sent from the webview view context
   *
   * @param message The message sent from the webview view context. Its parameters must be coordinated with the webview view context.
   */
  public static handleMessage(message: WebviewToExtensionMessage) {
    switch (message.messageType) {
      case "newConversation":
        vscode.commands.executeCommand("vscode-byolad.newConversation");
        break;
      case "clearConversations":
        vscode.commands.executeCommand("vscode-byolad.clearConversations");
        break;
      case "reviewCode":
        vscode.commands.executeCommand("vscode-byolad.reviewCode");
        break;
      case "explainCode":
        vscode.commands.executeCommand("vscode-byolad.explainCode");
        break;
      case "sendMessage": {
        const params = message.params as SendMessageParams;
        vscode.commands.executeCommand(
          "vscode-byolad.sendMessage",
          params.userInput,
          params.useCodeReference,
        );
        break;
      }
      case "diffLatestCodeBlock":
        vscode.commands.executeCommand("vscode-byolad.diffLatestCodeBlock");
        break;
      default:
        // TODO: How to handle?
        vscode.window.showErrorMessage(
          `Unknown message type received from webview: ${message.messageType}`,
        );
        break;
    }
  }
}

interface WebviewToExtensionMessage {
  messageType: string;
  params: WebviewToExtensionMessageParams;
}

interface WebviewToExtensionMessageParams {}

interface SendMessageParams extends WebviewToExtensionMessageParams {
  userInput: string;
  useCodeReference: boolean;
}
