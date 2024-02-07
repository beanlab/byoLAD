import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";
import { insertCode } from "../helpers/insertCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "./ChatViewProvider";
import { ChatMessage, Chat } from "../ChatModel/ChatModel";

export class ChatViewMessageHandler {
  private settingsProvider: SettingsProvider;
  chatManager: ChatManager;
  chatViewProvider: ChatWebviewProvider;

  constructor(
    settingsProvider: SettingsProvider,
    chatManager: ChatManager,
    chatViewProvider: ChatWebviewProvider,
  ) {
    this.chatManager = chatManager;
    this.chatViewProvider = chatViewProvider;
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
        this.chatViewProvider.updateChat(
          this.chatManager.chats,
          this.chatManager.activeChatId,
        );
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
        const params = message.params as DeleteChatParams;
        this.chatManager.deleteChat(params.chatId);
        this.chatViewProvider.updateChatList(this.chatManager.chats);
        break;
      }
      case "sendChatMessage": {
        const params = message.params as SendChatMessageMessageParams;
        vscode.commands.executeCommand(
          "vscode-byolad.sendChatMessage",
          params.userInput,
        );
        break;
      }
      case "copyToClipboard": {
        const params = message.params as CopyToClipboardMessageParams;
        await copyToClipboard(params.content);
        break;
      }
      case "diffCodeBlock": {
        const params = message.params as DiffCodeBlockParams;
        await diffCode(params.code, this.settingsProvider);
        break;
      }
      case "insertCodeBlock": {
        const params = message.params as InsertCodeBlockParams;
        await insertCode(params.code);
        break;
      }
      case "setActiveChat": {
        const params = message.params as SetActiveChatParams;
        this.chatManager.activeChatId = params.activeChatId;
        break;
      }
      case "updateChat": {
        const params = message.params as UpdateChatParams;
        this.chatManager.updateChat(params.chat);
        this.chatViewProvider.updateChat(
          this.chatManager.chats,
          this.chatManager.activeChatId,
        );
        break;
      }
      case "addCodeToChat": {
        await vscode.commands.executeCommand("vscode-byolad.addCodeToChat");
        break;
      }
      case "getHasSelection": {
        const hasSelection = !vscode.window.activeTextEditor?.selection.isEmpty;
        this.chatViewProvider.updateHasSelection(hasSelection);
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
  userInput: ChatMessage;
}

interface DiffCodeBlockParams extends WebviewToExtensionMessageParams {
  code: string;
}

interface InsertCodeBlockParams extends WebviewToExtensionMessageParams {
  code: string;
}

interface CopyToClipboardMessageParams extends WebviewToExtensionMessageParams {
  content: string;
}

interface SetActiveChatParams extends WebviewToExtensionMessageParams {
  activeChatId: number;
}

interface DeleteChatParams extends WebviewToExtensionMessageParams {
  chatId: number;
}

interface UpdateChatParams extends WebviewToExtensionMessageParams {
  chat: Chat;
}