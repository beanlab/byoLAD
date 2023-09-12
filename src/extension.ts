import * as vscode from "vscode";
import { injectCompletionModel } from "./helpers";
import { getReviewFileCodeCommand } from "./commands/getReviewFileCodeCommand";
import { getReviewSelectedCodeCommand } from "./commands/getReviewSelectedCodeCommand";
import { CompletionModelProvider } from "./CompletionModel/CompletionModelProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";

// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vs-code-ai-extension" is now active!',
  );

  const completionModelProvider = new CompletionModelProvider(
    injectCompletionModel(),
  );

  // For commands that have been defined in the package.json file,
  // provide the implementation with registerCommand.
  // The commandId parameter must match the command field in package.json

  const reviewFileCodeCommand = getReviewFileCodeCommand(
    completionModelProvider,
  );
  const reviewSelectedCodeCommand = getReviewSelectedCodeCommand(
    completionModelProvider,
  );
  const onDidChangeConfigurationHandler = getOnDidChangeConfigurationHandler(
    completionModelProvider,
  );

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    reviewFileCodeCommand,
    reviewSelectedCodeCommand,
    onDidChangeConfigurationHandler,
  );
}

// This method is called when the extension is deactivated
export function deactivate() {}
