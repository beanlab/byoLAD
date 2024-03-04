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
import { ChatWebviewProvider } from "./webview/ChatWebviewProvider";
import { getAddCodeToNewChatCommand } from "./commands/getAddCodeToNewChatCommand";
import { getAddCodeToChatCommand } from "./commands/getAddCodeToChatCommand";
import { setHasActiveChatWhenClauseState } from "./helpers";
import { getOnDidChangeTextEditorSelectionHandler } from "./helpers/getOnDidChangeTextEditorSelectionHandler";
import { ChatEditor } from "./Chat/ChatEditor";
import { LLMApiService } from "./ChatModel/LLMApiService";
import { LLMApiRequestSender } from "./ChatModel/LLMApiRequestSender";
import { LLMApiResponseHandler } from "./ChatModel/LLMApiResponseHandler";
import { WebviewToExtensionMessageHandler } from "./webview/WebviewToExtensionMessageHandler";
import { ExtensionToWebviewMessageSender } from "./webview/ExtensionToWebviewMessageSender";
import { PersonaDataManager } from "./Persona/PersonaDataManager";

// This method is automatically called by VS Code called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const personaDataManager = new PersonaDataManager(context);
  const chatDataManager = new ChatDataManager(
    context,
    settingsProvider,
    personaDataManager,
  );
  const chatWebviewProvider = new ChatWebviewProvider(context.extensionUri);
  const extensionToWebviewMessageSender = new ExtensionToWebviewMessageSender(
    chatWebviewProvider,
    chatDataManager,
    personaDataManager,
  );
  const chatEditor = new ChatEditor(
    chatDataManager,
    extensionToWebviewMessageSender,
  );
  const llmApiService = new LLMApiService(
    new LLMApiRequestSender(settingsProvider, personaDataManager, chatEditor),
    new LLMApiResponseHandler(chatEditor, extensionToWebviewMessageSender),
  );
  const webviewToExtensionMessageHandler = new WebviewToExtensionMessageHandler(
    settingsProvider,
    chatDataManager,
    personaDataManager,
    chatEditor,
    llmApiService,
    extensionToWebviewMessageSender,
    chatWebviewProvider,
  );
  chatWebviewProvider.setChatWebviewMessageHandler(
    webviewToExtensionMessageHandler,
  );
  setHasActiveChatWhenClauseState(!!chatDataManager.activeChatId);

  const chatWebviewDisposable = vscode.window.registerWebviewViewProvider(
    chatWebviewProvider.viewId,
    chatWebviewProvider,
  );

  // Get all commands and event handlers
  const newChatCommand = getNewChatCommand(
    chatDataManager,
    extensionToWebviewMessageSender,
  );
  const deleteAllChatsCommand = getDeleteAllChatsCommand(
    chatDataManager,
    extensionToWebviewMessageSender,
  );
  const reviewFileCodeCommand = getReviewCodeCommand(
    settingsProvider,
    chatDataManager,
    chatEditor,
    llmApiService,
    extensionToWebviewMessageSender,
    chatWebviewProvider,
  );
  const explainCodeCommand = getExplainCodeCommand(
    settingsProvider,
    chatDataManager,
    chatEditor,
    llmApiService,
    extensionToWebviewMessageSender,
    chatWebviewProvider,
  );
  const addCodeToChatCommand = getAddCodeToChatCommand(
    chatEditor,
    chatDataManager,
  );
  const addCodeToNewChatCommand = getAddCodeToNewChatCommand(
    chatDataManager,
    chatEditor,
    chatWebviewProvider,
  );
  const openSettingsCommand = getOpenSettingsCommand();

  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const onDidChangeTextEditorSelectionHandler =
    getOnDidChangeTextEditorSelectionHandler(extensionToWebviewMessageSender);
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
    chatWebviewDisposable,
    addCodeToChatCommand,
    addCodeToNewChatCommand,
  );
}

// This method is automatically called by VS Code called when the extension is deactivated
export function deactivate() {}
