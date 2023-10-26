import * as vscode from "vscode";
import {
  ChatMessage,
  ChatModelResponse,
  ChatRole,
  CodeBlock,
  MessageBlock,
  TextBlock,
} from "../ChatModel/ChatModel";
import { Conversation } from "../Conversation/conversation";
import { outputConversationHtml } from "../Conversation/outputConversationHtml";
import { ConversationManager } from "../Conversation/conversationManager";
import { SettingsProvider } from "../helpers/SettingsProvider";
import { getCodeReferenceIfUserWants } from "../helpers/getCodeReferenceIfUserWants";
import { getUserInputTextBlock } from "../helpers/getUserInputTextBlock";
import { sendMessage } from "../helpers/sendMessage";

export const getSendMessageCommand = (
  settingsProvider: SettingsProvider,
  conversationManager: ConversationManager
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vscode-byolad.sendMessage",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor"); // TODO: How to handle?
        return;
      }

      const codeReference = await getCodeReferenceIfUserWants(activeEditor);
      const messageTextBlock = await getUserInputTextBlock();
      if (!messageTextBlock) {
        vscode.window.showErrorMessage("No message to send"); // TODO: make constant
        return;
      }

      await sendMessage(
        messageTextBlock,
        codeReference,
        settingsProvider,
        conversationManager
      );
    }
  );
};
