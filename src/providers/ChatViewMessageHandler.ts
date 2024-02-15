import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";
import { insertCode } from "../helpers/insertCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "./ChatViewProvider";
import {
  ChatRole,
  WebviewToExtensionMessage,
  WebviewToExtensionMessageTypeMap,
} from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";

export class ChatViewMessageHandler {
  private readonly settingsProvider: SettingsProvider;
  private readonly chatDataManager: ChatDataManager;
  private readonly chatWebviewProvider: ChatWebviewProvider;
  private readonly chatEditor: ChatEditor;
  private readonly llmApiService: LLMApiService;

  constructor(
    settingsProvider: SettingsProvider,
    chatDataManager: ChatDataManager,
    chatWebviewProvider: ChatWebviewProvider,
    chatEditor: ChatEditor,
    llmApiService: LLMApiService,
  ) {
    this.chatDataManager = chatDataManager;
    this.chatWebviewProvider = chatWebviewProvider;
    this.settingsProvider = settingsProvider;
    this.chatEditor = chatEditor;
    this.llmApiService = llmApiService;
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
        this.chatDataManager.deleteChat(params.chatId);
        this.chatWebviewProvider.refresh();
        break;
      }
      case "sendChatMessage": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        this.chatWebviewProvider.updateIsMessageLoading(true);
        this.chatEditor.appendMarkdown(
          params.chat,
          ChatRole.User,
          params.userMarkdown,
        );
        await this.llmApiService.requestLlmApiChatResponse(params.chat);
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
        this.chatDataManager.activeChatId = params.activeChatId;
        break;
      }
      case "updateChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeMap[typeof message.messageType];
        this.chatDataManager.updateChat(params.chat); // Save changes to backend
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
