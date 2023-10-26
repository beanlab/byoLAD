import * as vscode from "vscode";
import {
  SendMessageRequest,
  WebviewToExtensionMessage,
} from "./WebviewExtensionMessage";

export class ChatViewMessageListener {
  constructor() {}

  /**
   * Handles messages sent from the webview view context
   *
   * @param message The message sent from the webview view context. Its type and contents must be coordinated with the webview view context.
   */
  public static receive(message: unknown) {
    switch ((message as WebviewToExtensionMessage).command) {
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
        const sendMessageRequest = message as SendMessageRequest;
        vscode.commands.executeCommand(
          "vscode-byolad.sendMessage",
          sendMessageRequest.userInput,
          sendMessageRequest.useCodeReference,
        );
        break;
      }
      case "diffLatestCodeBlock":
        vscode.commands.executeCommand("vscode-byolad.diffLatestCodeBlock");
        break;
      default:
        // TODO: How to handle?
        vscode.window.showErrorMessage(
          `Unknown command. Message received: ${message}`,
        );
        break;
    }
  }
}
