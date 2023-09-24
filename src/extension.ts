import * as vscode from "vscode";
import { getReviewFileCodeCommand } from "./commands/getReviewFileCodeCommand";
import { getReviewSelectedCodeCommand } from "./commands/getReviewSelectedCodeCommand";
import { SettingsProvider } from "./helpers/SettingsProvider";
import { getOnDidChangeConfigurationHandler } from "./helpers/getOnDidChangeConfigurationHandler";
import { getReviewCodeTextDocumentContentProvider } from "./helpers/getReviewCodeTextDocumentContentProvider";
import { getApplyProposedChangesCommand } from "./commands/getApplyProposedChangesCommand";
import { getReviewSelectedCodeCustomPromptCommand } from "./commands/getReviewSelectedCodeCustomPromptCommand";
import { getReviewFileCodeCustomPromptCommand } from "./commands/getReviewFileCodeCustomPromptCommand";

// This method is called when the extension is activated
// The extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vs-code-ai-extension" is now active!',
  );

  const config = vscode.workspace.getConfiguration("vs-code-ai-extension");
  const settingsProvider = new SettingsProvider(config);

  // For commands that have been defined in the package.json file,
  // provide the implementation with registerCommand.
  // The commandId parameter must match the command field in package.json

  const reviewFileCodeCommand = getReviewFileCodeCommand(settingsProvider);
  const reviewSelectedCodeCommand =
    getReviewSelectedCodeCommand(settingsProvider);
  const reviewFileCodeCustomPromptCommand =
    getReviewFileCodeCustomPromptCommand(settingsProvider);
  const reviewSelectedCodeCustomPromptCommand =
    getReviewSelectedCodeCustomPromptCommand(settingsProvider);
  const applyProposedChangesCommand = getApplyProposedChangesCommand();
  const onDidChangeConfigurationHandler =
    getOnDidChangeConfigurationHandler(settingsProvider);
  const reviewCodeTextDocumentContentProvider =
    getReviewCodeTextDocumentContentProvider();

  // Add the commands and event handlers to the extension context so they can be used
  context.subscriptions.push(
    reviewFileCodeCommand,
    reviewSelectedCodeCommand,
    reviewFileCodeCustomPromptCommand,
    reviewSelectedCodeCustomPromptCommand,
    applyProposedChangesCommand,
    onDidChangeConfigurationHandler,
    reviewCodeTextDocumentContentProvider,
  );
}

// This method is called when the extension is deactivated
export function deactivate() {}
