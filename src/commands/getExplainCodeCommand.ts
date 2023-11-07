import * as vscode from "vscode";
import { TextBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/ConversationManager";
import { getCodeReference } from "../helpers/getCodeReference";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";

export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
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

    await sendChatMessage(
      textBlock,
      codeReference,
      settingsProvider,
      conversationManager,
      null,
    );
  });
