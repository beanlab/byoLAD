import * as vscode from "vscode";
import { ChatRole, TextBlock } from "../ChatModel/ChatModel";
import { ChatManager } from "../Chat/ChatManager";
import { getCodeReference } from "../helpers/getCodeReference";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

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

    const codeReference = getCodeReference(activeEditor);

    const message = {
      role: ChatRole.User,
      content: codeReference ? [textBlock, codeReference] : [textBlock],
    };

    await ensureActiveWebviewAndChat(chatManager, chatWebviewProvider);

    const chat = chatManager.getActiveChat();
    chat?.messages.push(message);

    chatWebviewProvider.updateChat(chatManager.chats, chatManager.activeChatId);

    chatWebviewProvider.setLoading(true);

    await sendChatMessage(
      message,
      settingsProvider,
      chatManager,
      chatWebviewProvider,
    );
  });
