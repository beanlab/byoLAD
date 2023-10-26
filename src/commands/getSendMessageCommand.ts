import * as vscode from "vscode";
import { CodeBlock, TextBlock } from "../ChatModel/ChatModel";

import { ConversationManager } from "../Conversation/conversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendMessage } from "../helpers/sendMessage";
import { getCodeReference } from "../helpers/getCodeReference";

export const getSendMessageCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendMessage",
    async (userInput: string, useCodeReference: boolean) => {
      let codeReference: CodeBlock | null = null;
      if (useCodeReference) {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
          vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
          return;
        }
        codeReference = await getCodeReference(activeEditor);
      }

      const messageTextBlock = {
        content: userInput,
      } as TextBlock;

      await sendMessage(
        messageTextBlock,
        codeReference,
        settingsProvider,
        conversationManager,
      );
    },
  );
};
