import * as vscode from "vscode";
import { injectCompletionModel } from "./helpers";
import { getReviewFileCodeCommand } from "./commands/getReviewFileCodeCommand";
import { getReviewSelectedCodeCommand } from "./commands/getReviewSelectedCodeCommand";

// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vs-code-ai-extension" is now active!',
  );

  // There should be an event handler added for onDidChangeConfiguration to handle the case
  // where the user changes the model or API key while the extension is running.
  const completionModel = injectCompletionModel();

  // For commands that have been defined in the package.json file,
  // provide the implementation with registerCommand.
  // The commandId parameter must match the command field in package.json

  const reviewFileCodeCommand = getReviewFileCodeCommand(completionModel);
  const reviewSelectedCodeCommand =
    getReviewSelectedCodeCommand(completionModel);

  // Add the commands to the extension context so they can be used
  context.subscriptions.push(reviewFileCodeCommand);
  context.subscriptions.push(reviewSelectedCodeCommand);
}

// This method is called when the extension is deactivated
export function deactivate() {}
