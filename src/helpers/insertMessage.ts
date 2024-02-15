import * as vscode from "vscode";
import { ChatDataManager } from "../Chat/ChatDataManager";
import { Chat, ChatRole, TextBlock } from "../../shared/types";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { getCodeReference } from "./getCodeReference";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";

export async function insertMessage(
  chat: Chat,
  textBlock: TextBlock,
  activeEditor: vscode.TextEditor,
  chatDataManager: ChatDataManager,
  chatWebviewProvider: ChatWebviewProvider,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
) {
  const codeReference = getCodeReference(activeEditor);
  const messageBlocks = codeReference
    ? [textBlock, codeReference]
    : [textBlock];

  chatEditor.appendMessageBlocks(chat, ChatRole.User, messageBlocks); // TODO: ensure it's being passed by reference so what is sent to the LLM is with the new content
  chatWebviewProvider.updateIsMessageLoading(true);

  await llmApiService.requestLlmApiChatResponse(chat);
}
