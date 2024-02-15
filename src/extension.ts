import * as vscode from "vscode";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { ChatDataManager } from "./Chat/ChatDataManager";
import { getNewChatCommand } from "./commands/getNewChatCommand";
import { getDeleteAllChatsCommand } from "./commands/getDeleteAllChatsCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { ChatWebviewProvider } from "./providers/ChatViewProvider";
import { getAddCodeToNewChatCommand } from "./commands/getAddCodeToNewChatCommand";
import { getAddCodeToChatCommand } from "./commands/getAddCodeToChatCommand";
import { setHasActiveChatWhenClauseState } from "./helpers";
import { getOnDidChangeTextEditorSelectionHandler } from "./helpers/getOnDidChangeTextEditorSelectionHandler";
import { ChatEditor } from "./Chat/ChatEditor";
import { LLMApiService } from "./ChatModel/LLMApiService";
import { LLMApiRequestSender } from "./ChatModel/LLMApiRequestSender";
import { LLMApiResponseHandler } from "./ChatModel/LLMApiResponseHandler";
import { ChatViewMessageHandler } from "./providers/ChatViewMessageHandler";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const chatDataManager = new ChatDataManager(context, settingsProvider);
  const chatWebviewProvider = new ChatWebviewProvider(
    context.extensionUri,
    chatDataManager,
  );
  const chatEditor = new ChatEditor(chatDataManager, chatWebviewProvider);
  const llmApiService = new LLMApiService(
    new LLMApiRequestSender(settingsProvider),
    new LLMApiResponseHandler(chatEditor, chatWebviewProvider),
  );
  const chatViewMessageHandler = new ChatViewMessageHandler(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
    chatEditor,
    llmApiService,
  );
  chatWebviewProvider.setChatViewMessageHandler(chatViewMessageHandler);
  setHasActiveChatWhenClauseState(!!chatDataManager.activeChatId);

  const chatViewDisposable = vscode.window.registerWebviewViewProvider(
    ChatWebviewProvider.viewType,
    chatWebviewProvider,
  );

  const newChatCommand = getNewChatCommand(
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
    chatEditor,
    llmApiService,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
    chatEditor,
    llmApiService,
  );
  const addCodeToChatCommand = getAddCodeToChatCommand(
    chatEditor,
    chatDataManager,
  );
  const addCodeToNewChatCommand = getAddCodeToNewChatCommand(
    chatDataManager,
    chatEditor,
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
export function deactivate() {}
