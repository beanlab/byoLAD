import * as vscode from "vscode";
import { CodeBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "./ChatViewProvider";

export class ChatViewMessageHandler {
  conversationManager: ConversationManager;
  chatViewProvider: ChatWebviewProvider;

  constructor(
    conversationManager: ConversationManager,
    chatViewProvider: ChatWebviewProvider,
  ) {
    this.conversationManager = conversationManager;
    this.chatViewProvider = chatViewProvider;
  }

  /**
   * Handles messages sent from the webview view context
   *
   * @param message The message sent from the webview view context. Its parameters must be coordinated with the webview view context.
   */
  public handleMessage(message: WebviewToExtensionMessage) {
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
        vscode.commands.executeCommand(
          "vscode-byolad.diffCodeBlock",
          params.codeBlock,
        );
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
  codeBlock: CodeBlock;
}

interface GetCodeBlockParams extends WebviewToExtensionMessageParams {
  chatId: number;
}

interface SetActiveChatParams extends WebviewToExtensionMessageParams {
  activeConversationId: number;
}
