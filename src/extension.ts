import * as vscode from "vscode";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { ChatManager } from "./Chat/ChatManager";
import { getSendChatMessageCommand } from "./commands/getSendChatMessageCommand";
import { getNewChatCommand } from "./commands/getNewChatCommand";
import { getDeleteAllChatsCommand } from "./commands/getDeleteAllChatsCommand";
import { getDeleteChatCommand } from "./commands/getDeleteChatCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { ChatWebviewProvider } from "./providers/ChatViewProvider";
import { getAddCodeToNewChatCommand } from "./commands/getAddCodeToNewChatCommand";
import { getAddCodeToChatCommand } from "./commands/getAddCodeToChatCommand";
import { setHasActiveChatWhenClauseState } from "./helpers";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const chatManager = new ChatManager(context, settingsProvider);
  const chatWebviewProvider = new ChatWebviewProvider(
    context.extensionUri,
    settingsProvider,
    chatManager,
  );

  setHasActiveChatWhenClauseState(!!chatManager.activeChatId);

  const chatViewDisposable = vscode.window.registerWebviewViewProvider(
    ChatWebviewProvider.viewType,
    chatWebviewProvider,
  );

  const newChatCommand = getNewChatCommand(
    settingsProvider,
    chatManager,
    chatWebviewProvider,
  );
  const deleteAllChatsCommand = getDeleteAllChatsCommand(
    chatManager,
    chatWebviewProvider,
  );
  const deleteChatCommand = getDeleteChatCommand(
    chatManager,
    chatWebviewProvider,
  );
  const reviewFileCodeCommand = getReviewCodeCommand(
    settingsProvider,
    chatManager,
    chatWebviewProvider,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    chatManager,
    chatWebviewProvider,
  );
  const sendChatMessageCommand = getSendChatMessageCommand(
    settingsProvider,
    chatManager,
    chatWebviewProvider,
  );
  const addCodeToChatCommand = getAddCodeToChatCommand(
    chatWebviewProvider,
    chatManager,
  );
  const addCodeToNewChatCommand = getAddCodeToNewChatCommand(
    chatWebviewProvider,
    chatManager,
  );
  const openSettingsCommand = getOpenSettingsCommand();

  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const reviewCodeTextDocumentContentProvider =
    getReviewCodeTextDocumentContentProvider();

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    newChatCommand,
    deleteAllChatsCommand,
    deleteChatCommand,
    reviewFileCodeCommand,
    explainCodeCommand,
    sendChatMessageCommand,
    openSettingsCommand,
    onDidChangeConfigurationHandler,
    reviewCodeTextDocumentContentProvider,
    chatViewDisposable,
    addCodeToChatCommand,
    addCodeToNewChatCommand,
  );
}

// This method is called when the extension is deactivated
// export function deactivate() {}
