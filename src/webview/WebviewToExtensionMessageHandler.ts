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
import { ExtensionToWebviewMessageSender } from "./ExtensionToWebviewMessageSender";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { ChatWebviewProvider } from "./ChatWebviewProvider";
import { PersonaDataManager } from "../Persona/PersonaDataManager";

export class WebviewToExtensionMessageHandler {
  private readonly settingsProvider: SettingsProvider;
  private readonly chatDataManager: ChatDataManager;
  private readonly personaDataManager: PersonaDataManager;
  private readonly chatEditor: ChatEditor;
  private readonly llmApiService: LLMApiService;
  private readonly extensionToWebviewMessageSender: ExtensionToWebviewMessageSender;
  private readonly chatWebviewProvider: ChatWebviewProvider;

  constructor(
    settingsProvider: SettingsProvider,
    chatDataManager: ChatDataManager,
    personaDataManager: PersonaDataManager,
    chatEditor: ChatEditor,
    llmApiService: LLMApiService,
    extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
    chatWebviewProvider: ChatWebviewProvider,
  ) {
    this.settingsProvider = settingsProvider;
    this.chatDataManager = chatDataManager;
    this.personaDataManager = personaDataManager;
    this.chatEditor = chatEditor;
    this.llmApiService = llmApiService;
    this.extensionToWebviewMessageSender = extensionToWebviewMessageSender;
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
        await this.extensionToWebviewMessageSender.refresh();
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
        await this.extensionToWebviewMessageSender.refresh();
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
          this.extensionToWebviewMessageSender,
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
        await this.chatEditor.overwriteChatData(params.chat, updateWebiew);
        break;
      }
      case "addCodeToChat": {
        await vscode.commands.executeCommand("vscode-byolad.addCodeToChat");
        break;
      }
      case "getHasSelection": {
        const hasSelection = !vscode.window.activeTextEditor?.selection.isEmpty;
        await this.extensionToWebviewMessageSender.updateHasSelection(
          hasSelection,
        );
        break;
      }
      case "setDefaultPersonaId": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        this.personaDataManager.defaultPersonaId = params.personaId;
        await this.extensionToWebviewMessageSender.refresh();
        break;
      }
      case "updatePersona": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        this.personaDataManager.updatePersona(params.persona);
        await this.extensionToWebviewMessageSender.refresh();
        break;
      }
      case "deletePersona": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        this.personaDataManager.deletePersona(params.personaId);
        await this.extensionToWebviewMessageSender.refresh();
        break;
      }
      case "manageApiKeys": {
        const params =
          message.params as WebviewToExtensionMessageTypeParamsMap[typeof message.messageType];
        await vscode.commands.executeCommand(
          "vscode-byolad.manageApiKeys",
          params.modelProvider,
        );
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
