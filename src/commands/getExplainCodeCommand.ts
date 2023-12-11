import * as vscode from "vscode";
import { ChatRole, TextBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/ConversationManager";
import { getCodeReference } from "../helpers/getCodeReference";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ensureActiveWebviewAndConversation } from "../helpers/ensureActiveWebviewAndConversation";

export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
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

    await ensureActiveWebviewAndConversation(
      conversationManager,
      chatWebviewProvider,
    );
    await sendChatMessage(
      message,
      settingsProvider,
      conversationManager,
      chatWebviewProvider,
    );
  });
