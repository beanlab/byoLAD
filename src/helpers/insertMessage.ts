import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatRole, TextBlock } from "../../shared/types";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { SettingsProvider } from "./SettingsProvider";
import { getCodeReference } from "./getCodeReference";
import { ensureActiveWebviewAndChat } from "./ensureActiveWebviewAndChat";
import { sendChatMessage } from "./sendChatMessage";

export async function insertMessage(
  textBlock: TextBlock,
  activeEditor: vscode.TextEditor,
  settingsProvider: SettingsProvider,
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  const codeReference = getCodeReference(activeEditor);

  const message = {
    role: ChatRole.User,
    content: codeReference ? [textBlock, codeReference] : [textBlock],
  };

  await ensureActiveWebviewAndChat(chatDataManager, chatWebviewProvider);

  const chat = chatDataManager.getActiveChat();
  chat?.messages.push(message);

  chatWebviewProvider.refresh();

  chatWebviewProvider.updateIsMessageLoading(true);

  await sendChatMessage(
    message,
    settingsProvider,
    chatDataManager,
    chatWebviewProvider,
  );
}
