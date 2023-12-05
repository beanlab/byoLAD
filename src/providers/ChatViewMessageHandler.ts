import * as vscode from "vscode";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { diffCode } from "../helpers/diffCode";
import { insertCode } from "../helpers/insertCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "./ChatViewProvider";
import { ChatMessage, Conversation } from "../ChatModel/ChatModel";

export class ChatViewMessageHandler {
  private settingsProvider: SettingsProvider;
  conversationManager: ConversationManager;
  chatViewProvider: ChatWebviewProvider;

  constructor(
    settingsProvider: SettingsProvider,
    conversationManager: ConversationManager,
    chatViewProvider: ChatWebviewProvider,
  ) {
    this.conversationManager = conversationManager;
    this.chatViewProvider = chatViewProvider;
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
      case "getConversations":
        this.chatViewProvider.updateConversation(
          this.conversationManager.conversations,
          this.conversationManager.activeConversationId,
        );
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
      case "deleteConversation": {
        const params = message.params as DeleteConversationParams;
        vscode.commands.executeCommand(
          "vscode-byolad.deleteConversation",
          params.conversationId,
        );
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
      case "getCodeBlock": {
        const params = message.params as GetCodeBlockParams;
        this.conversationManager.activeConversationId = params.chatId;
        vscode.commands.executeCommand("vscode-byolad.addCodeToConversation");
        break;
      }
      case "setActiveChat": {
        const params = message.params as SetActiveChatParams;
        this.conversationManager.activeConversationId =
          params.activeConversationId;
        break;
      }
      case "updateChat": {
        const params = message.params as UpdateChatParams;
        this.conversationManager.updateConversation(params.chat);
        this.chatViewProvider.updateConversation(
          this.conversationManager.conversations,
          this.conversationManager.activeConversationId,
        );
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

interface GetCodeBlockParams extends WebviewToExtensionMessageParams {
  chatId: number;
}

interface SetActiveChatParams extends WebviewToExtensionMessageParams {
  activeConversationId: number;
}

interface GetCodeBlockParams extends WebviewToExtensionMessageParams {
  chatId: number;
}

interface SetActiveChatParams extends WebviewToExtensionMessageParams {
  activeConversationId: number;
}

interface DeleteConversationParams extends WebviewToExtensionMessageParams {
  conversationId: number;
}

interface UpdateChatParams extends WebviewToExtensionMessageParams {
  chat: Conversation;
}
