import * as vscode from "vscode";
import { CodeBlock } from "../ChatModel/ChatModel";
import { getCodeReference } from "./getCodeReference";

/**
 * Asks the user if they want to include a code reference in their message to the LLM.
 * If they do, returns the appropriate code block (either the whole document or the selected text).
 *
 * @param useCodeReferenceCaption The caption to display to the user for the true (use code reference) option.
 * @returns The code block to use as a reference, or null if the user does not want to use a code reference.
 */
export async function getCodeReferenceIfUserWants(
  activeEditor: vscode.TextEditor
): Promise<CodeBlock | null> {
  let useCodeReferenceCaption = "Use whole document as code reference";
  if (!activeEditor.selection.isEmpty) {
    useCodeReferenceCaption = "Use selected text as code reference";
  }
  const useCodeReference = await vscode.window
    .showQuickPick([useCodeReferenceCaption, "Do not use code reference"])
    .then((value) => {
      return value === useCodeReferenceCaption;
    });

  let codeBlock: CodeBlock | null = null;
  if (useCodeReference) {
    codeBlock = getCodeReference(activeEditor);
  }
  return codeBlock;
}
