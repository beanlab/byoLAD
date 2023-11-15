import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";

export class ChatViewMessageHandler {
  private settingsProvider: SettingsProvider;

  constructor(settingsProvider: SettingsProvider) {
    this.settingsProvider = settingsProvider;
  }

  /**
   * Handles messages sent from the webview view context
   *
   * @param message The message sent from the webview view context. Its parameters must be coordinated with the webview view context.
   */
  public async handleMessage(message: WebviewToExtensionMessage) {
    switch (message.messageType) {
      case "newConversation":
        vscode.commands.executeCommand("vscode-byolad.newConversation");
        break;
      case "deleteAllConversations":
        vscode.commands.executeCommand("vscode-byolad.deleteAllConversations");
        break;
      case "reviewCode":
        vscode.commands.executeCommand("vscode-byolad.reviewCode");
        break;
      case "explainCode":
        vscode.commands.executeCommand("vscode-byolad.explainCode");
        break;
      case "sendChatMessage": {
        const params = message.params as SendChatMessageMessageParams;
        vscode.commands.executeCommand(
          "vscode-byolad.sendChatMessage",
          params.userInput,
          params.useCodeReference,
        );
        break;
      }
      case "diffCodeBlock": {
        const params = message.params as DiffCodeBlockParams;
        await diffCode(params.code, this.settingsProvider);
        break;
      }
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

interface SendChatMessageMessageParams extends WebviewToExtensionMessageParams {
  userInput: string;
  useCodeReference: boolean;
}

interface DiffCodeBlockParams extends WebviewToExtensionMessageParams {
  code: string;
}
