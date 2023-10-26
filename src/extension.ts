import * as vscode from "vscode";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { ConversationManager } from "./Conversation/conversationManager";
import { getSendMessageCommand } from "./commands/getSendMessageCommand";
import { getStartConversationCommand } from "./commands/getStartConversationCommand";
import { getClearConversationsCommand } from "./commands/getClearConversationsCommand";
import { getDiffLatestCodeBlockCommand } from "./commands/getDiffLatestCodeBlockCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { ChatViewProvider } from "./providers/ChatViewProvider";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const conversationManager = new ConversationManager(context);
  const webviewProvider = new ChatViewProvider(context.extensionUri);

  const chatViewDisposable = vscode.window.registerWebviewViewProvider(
    ChatViewProvider.viewType,
    webviewProvider,
  );

  const startConversationCommand = getStartConversationCommand(
    settingsProvider,
    conversationManager,
  );
  const clearConversationsCommand =
    getClearConversationsCommand(conversationManager);
  const reviewFileCodeCommand = getReviewCodeCommand(
    settingsProvider,
    conversationManager,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    conversationManager,
  );
  const sendMessageCommand = getSendMessageCommand(
    settingsProvider,
    conversationManager,
  );
  const diffLatestCodeBlockCommand = getDiffLatestCodeBlockCommand(
    settingsProvider,
    conversationManager,
  );
  const openSettingsCommand = getOpenSettingsCommand();

  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const reviewCodeTextDocumentContentProvider =
    getReviewCodeTextDocumentContentProvider();

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    startConversationCommand,
    clearConversationsCommand,
    reviewFileCodeCommand,
    explainCodeCommand,
    sendMessageCommand,
    diffLatestCodeBlockCommand,
    openSettingsCommand,
    onDidChangeConfigurationHandler,
    reviewCodeTextDocumentContentProvider,
    chatViewDisposable,
  );
}

// This method is called when the extension is deactivated
// export function deactivate() {}
