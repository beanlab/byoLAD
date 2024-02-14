import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { addSelectedCodeToChat } from "../helpers/addSelectedCodeToChat";

export const getAddCodeToNewChatCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  chatDataManager: ChatDataManager,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToNewChat",
    async () => {
      chatDataManager.startChat("Code Chat"); // TODO: How to name?
      addSelectedCodeToChat(chatDataManager, chatWebviewProvider);
      await vscode.commands.executeCommand("vscode-byolad.chat.focus");
      chatWebviewProvider.refresh();
    },
  );
