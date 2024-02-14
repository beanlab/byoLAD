import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";

/**
 * Command to add the selected code (or whole file if no selection) to the active chat.
 * Opens webview and/or starts chat if necessary.
 */

export const getAddCodeToChatCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  chatDataManager: ChatDataManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.addCodeToChat", async () => {
    addSelectedCodeToChat(chatDataManager, chatWebviewProvider);
    chatWebviewProvider.refresh();
  });
