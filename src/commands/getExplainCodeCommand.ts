import * as vscode from "vscode";
import { TextBlock } from "../ChatModel/ChatModel";
import { ConversationManager } from "../Conversation/conversationManager";
import { getCodeReference } from "../helpers/getCodeReference";
import { sendMessage } from "../helpers/sendMessage";
import { SettingsProvider } from "../helpers/SettingsProvider";

export const getExplainCodeCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
) =>
  vscode.commands.registerCommand("vscode-byolad.explainCode", async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }

    const textBlock = {
      type: "text",
      content:
        "Please explain the following code to me. Tell it to me in a way that I can easily understand without using too many words. You may explain it piece by piece with appropriate code references if that's useful.", // TODO: Get this from settings, change default to not provide the overall formatting instructions
    } as TextBlock;

    const codeReference = getCodeReference(activeEditor);

    await sendMessage(
      textBlock,
      codeReference,
      settingsProvider,
      conversationManager
    );
  });
