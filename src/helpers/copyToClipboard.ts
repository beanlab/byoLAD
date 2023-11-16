import * as vscode from "vscode";

/**
 * Copies the given content to the user's clipboard.
 * @param content
 */
export async function copyToClipboard(content: string) {
  try {
    await vscode.env.clipboard.writeText(content);
    vscode.window.showInformationMessage("Copied to clipboard.");
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to copy to clipboard: ${error}`);
  }
}
