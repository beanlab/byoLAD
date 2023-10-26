import * as vscode from "vscode";
import { MessageBlock, TextBlock, CodeBlock } from "../ChatModel/ChatModel";

export function stringToMessageBlocks(text: string): MessageBlock[] {
  vscode.window
    .createOutputChannel("vscode-byolad: Response Content")
    .appendLine(text); // TODO: DELETE ME
  return JSON.parse(text) as MessageBlock[];
}

export function messageBlocksToString(messageBlocks: MessageBlock[]): string {
  return JSON.stringify(messageBlocks);
}
