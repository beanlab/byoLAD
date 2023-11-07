import * as vscode from "vscode";
import { CodeBlock, TextBlock } from "../ChatModel/ChatModel";

import { ConversationManager } from "../Conversation/ConversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { getCodeReference } from "../helpers/getCodeReference";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";

export const getSendChatMessageCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager,
  currentPanel: ChatWebviewProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendChatMessage",
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

      await sendChatMessage(
        messageTextBlock,
        codeReference,
        settingsProvider,
        conversationManager,
        currentPanel,
      );
    },
  );
};
