import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";
import { insertCode } from "../helpers/insertCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { ChatDataManager } from "../Chat/ChatDataManager";
import {
  WebviewToExtensionMessage,
  WebviewToExtensionMessageTypeParamsMap,
} from "../../shared/types";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewMessageSender } from "./ChatWebviewMessageSender";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "./ChatWebviewProvider";

export class ChatWebviewMessageHandler {
  private readonly settingsProvider: SettingsProvider;
  private readonly chatDataManager: ChatDataManager;
  private readonly chatEditor: ChatEditor;
  private readonly llmApiService: LLMApiService;
  private readonly chatWebviewMessageSender: ChatWebviewMessageSender;
  private readonly chatWebviewProvider: ChatWebviewProvider;

  constructor(
    settingsProvider: SettingsProvider,
    chatDataManager: ChatDataManager,
    chatEditor: ChatEditor,
    llmApiService: LLMApiService,
    chatWebviewMessageSender: ChatWebviewMessageSender,
    chatWebviewProvider: ChatWebviewProvider,
  ) {
    this.chatDataManager = chatDataManager;
    this.settingsProvider = settingsProvider;
    this.chatEditor = chatEditor;
    this.llmApiService = llmApiService;
    this.chatWebviewMessageSender = chatWebviewMessageSender;
    this.chatWebviewProvider = chatWebviewProvider;
  }

  /**
   * Handles messages sent from the webview view context.
   *
   * @param message The message sent from the webview view context. Its parameters must be coordinated with the webview view context.
   */
  public async handleMessage(message: WebviewToExtensionMessage) {
    switch (message.messageType) {
      case "newChat":
        await vscode.commands.executeCommand("vscode-byolad.newChat");
        break;
      case "getChats":
        await this.chatWebviewMessageSender.refresh();
        break;
      case "deleteAllChats":
        await vscode.commands.executeCommand("vscode-byolad.deleteAllChats");
        break;
      case "reviewCode":
        await vscode.commands.executeCommand("vscode-byolad.reviewCode");
        break;
      case "explainCode":
        await vscode.commands.executeCommand("vscode-byolad.explainCode");
        break;
      case "deleteChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        this.chatDataManager.deleteChat(params.chatId);
        await this.chatWebviewMessageSender.refresh();
        break;
      }
      case "sendChatMessage": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        const includeCodeFromEditor = false;
        await sendChatMessage(
          params.chat,
          params.userMarkdown,
          includeCodeFromEditor,
          this.chatWebviewMessageSender,
          this.chatEditor,
          this.chatDataManager,
          this.llmApiService,
          this.chatWebviewProvider,
        );
        break;
      }
      case "copyToClipboard": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        await copyToClipboard(params.content);
        break;
      }
      case "diffCodeBlock": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        await diffCode(params.code, this.settingsProvider);
        break;
      }
      case "insertCodeBlock": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        await insertCode(params.code);
        break;
      }
      case "setActiveChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        this.chatDataManager.activeChatId = params.activeChatId;
        break;
      }
      case "updateChat": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        const updateWebiew = true;
        await this.chatEditor.overwriteChatContent(params.chat, updateWebiew);
        break;
      }
      case "addCodeToChat": {
        await vscode.commands.executeCommand("vscode-byolad.addCodeToChat");
        break;
      }
      case "getHasSelection": {
        const hasSelection = !vscode.window.activeTextEditor?.selection.isEmpty;
        await this.chatWebviewMessageSender.updateHasSelection(hasSelection);
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
