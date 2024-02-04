import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { insertMessage } from "../helpers/insertMessage";
import { TextBlock } from "../ChatModel/ChatModel";

/**
 * Command to explain the selected code (or whole file if no selection) in a chat.
 * Sends the selection and the user's configured prompt as a chat message.
 * Opens the webview and/or starts a new chat if necessary.
 */
export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  chatManager: ChatManager,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand("vscode-byolad.explainCode", async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }

    const textBlock = {
      type: "text",
      content: settingsProvider.getExplainCodePrompt(),
    } as TextBlock;

    insertMessage(
      textBlock,
      activeEditor,
      settingsProvider,
      chatManager,
      chatWebviewProvider,
    );
  });
