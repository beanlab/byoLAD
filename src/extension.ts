import * as vscode from "vscode";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { ConversationManager } from "./Conversation/ConversationManager";
import { getSendChatMessageCommand } from "./commands/getSendChatMessageCommand";
import { getNewConversationCommand } from "./commands/getNewConversationCommand";
import { getDeleteAllConversationsCommand } from "./commands/getDeleteAllConversationsCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { ChatWebviewProvider } from "./providers/ChatViewProvider";
import { getRefreshChatViewCommand } from "./commands/getRefreshChatViewCommand";
import { getDiffCodeBlockCommand } from "./commands/getDiffCodeBlockCommand";
import { getAddCodeToConversationCommand } from "./commands/getAddCodeToConversationCommand";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const conversationManager = new ConversationManager(context);
  const chatWebviewProvider = new ChatWebviewProvider(
    context.extensionUri,
    conversationManager,
  );

  const chatViewDisposable = vscode.window.registerWebviewViewProvider(
    ChatWebviewProvider.viewType,
    chatWebviewProvider,
  );

  const newConversationCommand = getNewConversationCommand(
    settingsProvider,
    conversationManager,
    chatWebviewProvider,
  );
  const deleteAllConversationsCommand = getDeleteAllConversationsCommand(
    conversationManager,
    chatWebviewProvider,
  );
  const reviewFileCodeCommand = getReviewCodeCommand(
    settingsProvider,
    conversationManager,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    conversationManager,
  );
  const sendChatMessageCommand = getSendChatMessageCommand(
    settingsProvider,
    conversationManager,
    chatWebviewProvider,
  );
  const diffCodeBlockCommand = getDiffCodeBlockCommand(
    settingsProvider,
    conversationManager,
  );
  const refreshChatViewCommand = getRefreshChatViewCommand(
    chatWebviewProvider,
    conversationManager,
  );
  const addCodeToConversationCommand = getAddCodeToConversationCommand(
    chatWebviewProvider,
    conversationManager,
  );
  const openSettingsCommand = getOpenSettingsCommand();

  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const reviewCodeTextDocumentContentProvider =
    getReviewCodeTextDocumentContentProvider();

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    newConversationCommand,
    deleteAllConversationsCommand,
    reviewFileCodeCommand,
    explainCodeCommand,
    sendChatMessageCommand,
    diffCodeBlockCommand,
    refreshChatViewCommand,
    openSettingsCommand,
    onDidChangeConfigurationHandler,
    reviewCodeTextDocumentContentProvider,
    chatViewDisposable,
    addCodeToConversationCommand,
  );
}

// This method is called when the extension is deactivated
// export function deactivate() {}
