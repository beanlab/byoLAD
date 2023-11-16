import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/ConversationManager";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { getCodeReference } from "../helpers/getCodeReference";
import { ChatRole, CodeBlock, MessageBlock } from "../ChatModel/ChatModel";

export const getAddCodeToConversationCommand = (
  chatWebviewProvider: ChatWebviewProvider,
  conversationManager: ConversationManager,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.addCodeToConversation",
    async () => {
      const activeConversationId = conversationManager.activeConversationId;
      if (activeConversationId) {
        const activeConversation =
          conversationManager.getConversation(activeConversationId);
        if (activeConversation) {
          const activeEditor = vscode.window.activeTextEditor;
          if (activeEditor) {
            const codeBlock = getCodeReference(
              activeEditor,
            ) as CodeBlock | null;
            if (codeBlock) {
              const updatedConversation = { ...activeConversation };
              let lastMessage;

              if (
                !updatedConversation.messages ||
                updatedConversation.messages.length === 0
              ) {
                updatedConversation.messages = [];
                const newMessage = {
                  role: ChatRole.User,
                  content: [] as MessageBlock[],
                };
                updatedConversation.messages.push(newMessage);
                lastMessage = newMessage;
              } else {
                lastMessage =
                  updatedConversation.messages[
                    updatedConversation.messages.length - 1
                  ];
              }

              if (lastMessage.role === ChatRole.User) {
                lastMessage.content.push(codeBlock);
              } else {
                const newMessage = {
                  role: ChatRole.User,
                  content: [codeBlock] as MessageBlock[],
                };
                updatedConversation.messages.push(newMessage);
              }

              conversationManager.updateConversation(updatedConversation);
              chatWebviewProvider.updateConversation(
                conversationManager.conversations,
                updatedConversation.id,
              );
            }
          }
        }
      }
    },
  );
