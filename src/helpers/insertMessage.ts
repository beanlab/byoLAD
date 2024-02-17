import * as vscode from "vscode";
import { Chat, ChatRole, TextBlock } from "../../shared/types";
import { getCodeReference } from "./getCodeReference";
import { ChatEditor } from "../Chat/ChatEditor";
import { LLMApiService } from "../ChatModel/LLMApiService";
import { ChatWebviewMessageSender } from "../providers/ChatWebviewMessageSender";

export async function insertMessage(
  chat: Chat,
  textBlock: TextBlock,
  activeEditor: vscode.TextEditor,
  chatEditor: ChatEditor,
  llmApiService: LLMApiService,
  chatWebviewMessageSender: ChatWebviewMessageSender,
) {
  const codeReference = getCodeReference(activeEditor);
  const messageBlocks = codeReference
    ? [textBlock, codeReference]
    : [textBlock];

  await chatEditor.appendMessageBlocks(chat, ChatRole.User, messageBlocks); // TODO: ensure it's being passed by reference so what is sent to the LLM is with the new content
  await chatWebviewMessageSender.updateIsMessageLoading(true);
  await llmApiService.requestLlmApiChatResponse(chat);
}
