import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";
import { insertCode } from "../helpers/insertCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "./ChatViewProvider";
import {
  WebviewToExtensionMessage,
  WebviewToExtensionMessageTypeMap,
} from "../../shared/types";

export class ChatViewMessageHandler {
  private settingsProvider: SettingsProvider;
  chatManager: ChatManager;
  chatWebviewProvider: ChatWebviewProvider;

  constructor(
    settingsProvider: SettingsProvider,
    chatManager: ChatManager,
    chatWebviewProvider: ChatWebviewProvider,
  ) {
    this.chatManager = chatManager;
    this.chatWebviewProvider = chatWebviewProvider;
    this.settingsProvider = settingsProvider;
  }

  /**
   * Handles messages sent from the webview view context.
   *
   * @param message The message sent from the webview view context. Its parameters must be coordinated with the webview view context.
   */
  public async handleMessage(message: WebviewToExtensionMessage) {
    switch (message.messageType) {
      case "newChat":
        vscode.commands.executeCommand("vscode-byolad.newChat");
        break;
      case "getChats":
        this.chatWebviewProvider.refresh();
        break;
      case "deleteAllChats":
        vscode.commands.executeCommand("vscode-byolad.deleteAllChats");
        break;
      case "reviewCode":
        vscode.commands.executeCommand("vscode-byolad.reviewCode");
        break;
      case "explainCode":
        vscode.commands.executeCommand("vscode-byolad.explainCode");
        break;
      case "deleteChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        this.chatManager.deleteChat(params.chatId);
        this.chatWebviewProvider.refresh();
        break;
      }
      case "sendChatMessage": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        vscode.commands.executeCommand(
          "vscode-byolad.sendChatMessage",
          params.userInput,
        );
        break;
      }
      case "copyToClipboard": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        await copyToClipboard(params.content);
        break;
      }
      case "diffCodeBlock": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        await diffCode(params.code, this.settingsProvider);
        break;
      }
      case "insertCodeBlock": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        await insertCode(params.code);
        break;
      }
      case "setActiveChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        this.chatManager.activeChatId = params.activeChatId;
        break;
      }
      case "updateChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        this.chatManager.updateChat(params.chat); // Save changes to backend
        this.chatWebviewProvider.refresh();
        break;
      }
      case "addCodeToChat": {
        await vscode.commands.executeCommand("vscode-byolad.addCodeToChat");
        break;
      }
      case "getHasSelection": {
        const hasSelection = !vscode.window.activeTextEditor?.selection.isEmpty;
        this.chatWebviewProvider.updateHasSelection(hasSelection);
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
