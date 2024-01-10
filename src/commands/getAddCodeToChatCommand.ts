import * as vscode from "vscode";
import { ChatManager } from "../Chat/ChatManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { getCodeReference } from "../helpers/getCodeReference";
import { ChatRole, CodeBlock, MessageBlock } from "../ChatModel/ChatModel";
import { ensureActiveWebviewAndChat } from "../helpers/ensureActiveWebviewAndChat";

/**
 * Command to add the selected code (or whole file if no selection) to the active chat.
 * Opens webview and/or starts chat if necessary.
 */
export const getAddCodeToChatCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  chatManager: ChatManager,
) =>
  vscode.commands.registerCommand("vscode-byolad.addCodeToChat", async () => {
    await ensureActiveWebviewAndChat(chatManager, chatWebviewProvider);

    const activeChatId = chatManager.activeChatId;
    if (activeChatId) {
      const activeChat = chatManager.getChat(activeChatId);
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
              lastMessage =
                updatedChat.messages[updatedChat.messages.length - 1];
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

            chatManager.updateChat(updatedChat);
            chatWebviewProvider.updateChat(chatManager.chats, updatedChat.id);
          }
        }
      }
    }
  });
