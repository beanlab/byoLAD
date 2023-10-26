import * as vscode from "vscode";
import { TextBlock } from "../ChatModel/ChatModel";

export async function getUserInputTextBlock(): Promise<TextBlock | undefined> {
  const userInput = await vscode.window.showInputBox({
    prompt: "Enter your message here",
    value: "",
    valueSelection: [0, 0],
    ignoreFocusOut: true,
    validateInput: (text) => {
      return text ? null : "Enter your message here"; // TODO: make this a constant
    },
  });
  if (!userInput) {
    return undefined;
  }
  return {
    type: "text",
    content: userInput,
  };
}
