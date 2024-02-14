import * as vscode from "vscode";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { ChatDataManager } from "./Chat/ChatDataManager";
import { getSendChatMessageCommand } from "./commands/getSendChatMessageCommand";
import { getNewChatCommand } from "./commands/getNewChatCommand";
import { getDeleteAllChatsCommand } from "./commands/getDeleteAllChatsCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { ChatWebviewProvider } from "./providers/ChatViewProvider";
import { getAddCodeToNewChatCommand } from "./commands/getAddCodeToNewChatCommand";
import { getAddCodeToChatCommand } from "./commands/getAddCodeToChatCommand";
import { setHasActiveChatWhenClauseState } from "./helpers";
import { getOnDidChangeTextEditorSelectionHandler } from "./helpers/getOnDidChangeTextEditorSelectionHandler";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const chatDataManager = new ChatDataManager(context, settingsProvider);
  const chatWebviewProvider = new ChatWebviewProvider(
    context.extensionUri,
    settingsProvider,
    chatDataManager,
  );

  setHasActiveChatWhenClauseState(!!chatDataManager.activeChatId);

  const chatViewDisposable = vscode.window.registerWebviewViewProvider(
    ChatWebviewProvider.viewType,
    chatWebviewProvider,
  );

  const newChatCommand = getNewChatCommand(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
  );
  const deleteAllChatsCommand = getDeleteAllChatsCommand(
    chatDataManager,
    chatWebviewProvider,
  );
  const reviewFileCodeCommand = getReviewCodeCommand(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
  );
  const sendChatMessageCommand = getSendChatMessageCommand(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
  );
  const addCodeToChatCommand = getAddCodeToChatCommand(
    chatWebviewProvider,
    chatDataManager,
  );
  const addCodeToNewChatCommand = getAddCodeToNewChatCommand(
    chatWebviewProvider,
    chatDataManager,
  );
  const openSettingsCommand = getOpenSettingsCommand();

  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const onDidChangeTextEditorSelectionHandler =
    getOnDidChangeTextEditorSelectionHandler(chatWebviewProvider);
  const reviewCodeTextDocumentContentProvider =
    getReviewCodeTextDocumentContentProvider();

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    newChatCommand,
    deleteAllChatsCommand,
    reviewFileCodeCommand,
    explainCodeCommand,
    sendChatMessageCommand,
    openSettingsCommand,
    onDidChangeConfigurationHandler,
    onDidChangeTextEditorSelectionHandler,
    reviewCodeTextDocumentContentProvider,
    chatViewDisposable,
    addCodeToChatCommand,
    addCodeToNewChatCommand,
  );
}

// This method is called when the extension is deactivated
// export function deactivate() {}
