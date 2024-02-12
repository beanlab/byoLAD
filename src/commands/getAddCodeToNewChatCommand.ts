import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";

export const getAddCodeToNewChatCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  chatManager: ChatManager,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToNewChat",
    async () => {
      chatManager.startChat("Code Chat"); // TODO: How to name?
      addSelectedCodeToChat(chatManager, chatWebviewProvider);
      await vscode.commands.executeCommand("vscode-byolad.chat.focus");
      chatWebviewProvider.refresh();
    },
  );
