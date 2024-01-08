import * as vscode from "vscode";
import { ChatRole, TextBlock } from "../ChatModel/ChatModel";
import { ChatManager } from "../Chat/ChatManager";
import { getCodeReference } from "../helpers/getCodeReference";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

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
    await sendChatMessage(
      message,
      settingsProvider,
      chatManager,
      chatWebviewProvider,
    );
  });
