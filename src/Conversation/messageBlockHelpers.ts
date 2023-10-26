import * as vscode from "vscode";
import { MessageBlock } from "../ChatModel/ChatModel";

export function stringToMessageBlocks(text: string): MessageBlock[] {
  vscode.window
    .createOutputChannel("vscode-byolad: Response Content")
    .appendLine(text); // TODO: DELETE ME
  return JSON.parse(text) as MessageBlock[]; // TODO: Change to parsing the markdown response as discussed in class
}

export function messageBlocksToString(messageBlocks: MessageBlock[]): string {
  return JSON.stringify(messageBlocks); // TODO: Change to sending markdown formatted request as discussed in class
}
