import * as vscode from "vscode";

import { ChatDataManager } from "./Chat/ChatDataManager";
import { ChatEditor } from "./Chat/ChatEditor";
import { LLMApiRequestSender } from "./ChatModel/LLMApiRequestSender";
import { LLMApiResponseHandler } from "./ChatModel/LLMApiResponseHandler";
import { LLMApiService } from "./ChatModel/LLMApiService";
import { getAddCodeToChatCommand } from "./commands/getAddCodeToChatCommand";
import { getAddCodeToNewChatCommand } from "./commands/getAddCodeToNewChatCommand";
import { getDeleteAllChatsCommand } from "./commands/getDeleteAllChatsCommand";
import { getExplainCodeCommand } from "./commands/getExplainCodeCommand";
import { getManageApiKeysCommand } from "./commands/getManageApiKeysCommand";
import { getNewChatCommand } from "./commands/getNewChatCommand";
import { getOpenSettingsCommand } from "./commands/getOpenSettingsCommand";
import { getReviewCodeCommand } from "./commands/getReviewCodeCommand";
import { setHasActiveChatWhenClauseState } from "./helpers";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getOnDidChangeTextEditorSelectionHandler } from "./helpers/getOnDidChangeTextEditorSelectionHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { SecretsProvider } from "./helpers/SecretsProvider";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { PersonaDataManager } from "./Persona/PersonaDataManager";
import { ChatWebviewProvider } from "./webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "./webview/ExtensionToWebviewMessageSender";
import { WebviewToExtensionMessageHandler } from "./webview/WebviewToExtensionMessageHandler";

// This method is automatically called by VS Code called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode-byolad");
  const settingsProvider = new SettingsProvider(config);
  const secretsProvider = new SecretsProvider(context);
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
    new LLMApiRequestSender(
      personaDataManager,
      chatEditor,
      secretsProvider,
      extensionToWebviewMessageSender,
    ),
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
    extensionToWebviewMessageSender,
  );
  const openSettingsCommand = getOpenSettingsCommand();
  const manageApiKeysCommand = getManageApiKeysCommand(secretsProvider);

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
    manageApiKeysCommand,
  );
}

// This method is automatically called by VS Code called when the extension is deactivated
export function deactivate() {}
