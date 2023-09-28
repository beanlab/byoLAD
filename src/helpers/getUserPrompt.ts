import * as vscode from "vscode";
import { PROMPT_FOR_USER_PROMPT } from "../commands/constants";

export const getUserPrompt = async (): Promise<string | undefined> => {
  const userPrompt = await vscode.window.showInputBox({
    prompt: PROMPT_FOR_USER_PROMPT,
    value: "",
    valueSelection: [0, 0],
    ignoreFocusOut: true,
    validateInput: (text) => {
      return text ? null : PROMPT_FOR_USER_PROMPT;
    },
  });
  return userPrompt;
};
