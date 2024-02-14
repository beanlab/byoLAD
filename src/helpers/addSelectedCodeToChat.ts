import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { getCodeReference } from "./getCodeReference";
import { ChatRole, CodeBlock, MessageBlock } from "../../shared/types";

export function addSelectedCodeToChat(
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
) {
  console.log(chatWebviewProvider);
  const activeChat = chatDataManager.getActiveChat();
  if (activeChat) {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const codeBlock = getCodeReference(activeEditor) as CodeBlock | null;
      if (codeBlock) {
        const updatedChat = { ...activeChat };
        let lastMessage;

        if (!updatedChat.messages || updatedChat.messages.length === 0) {
          updatedChat.messages = [];
          const newMessage = {
            role: ChatRole.User,
            content: [] as MessageBlock[],
          };
          updatedChat.messages.push(newMessage);
          lastMessage = newMessage;
        } else {
          lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
        }

        if (lastMessage.role === ChatRole.User) {
          lastMessage.content.push(codeBlock);
        } else {
          const newMessage = {
            role: ChatRole.User,
            content: [codeBlock] as MessageBlock[],
          };
          updatedChat.messages.push(newMessage);
        }

        chatDataManager.updateChat(updatedChat);
      }
    }
  }
}