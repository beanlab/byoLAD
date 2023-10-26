import * as vscode from "vscode";
import { ConversationManager } from "../Conversation/conversationManager";

export const getClearConversationsCommand = (
  conversationManager: ConversationManager
) =>
  vscode.commands.registerCommand("vscode-byolad.clearConversations", () => {
    conversationManager.clearAllConversations();
    vscode.window.showInformationMessage("Cleared all conversations");
  });
