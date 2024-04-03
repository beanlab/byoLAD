import * as vscode from "vscode";

export function getCurrentOpenFileName(): string | undefined {
  try {
    const currentlyOpenTabfilePath =
      vscode.window.activeTextEditor?.document.fileName;
    const filename = currentlyOpenTabfilePath?.replace(/^.*[\\/]/, "");
    return filename;
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to get file name: ${error}`);
  }
}
