// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { injectCompletionModel } from "./helpers/injectCompletionModel";
import { CompletionModelResponse } from "./CompletionModel/CompletionModel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vs-code-ai-extension" is now active!',
  );

  // There should be an event handler added for onDidChangeConfiguration to handle the case
  // where the user changes the model or API key while the extension is running.
  const completionModel = injectCompletionModel();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "vs-code-ai-extension.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from vs-code-ai-extension!",
      );
    },
  );

  const reviewFileCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewFileCode",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      const code = activeEditor?.document.getText();
      if (!activeEditor || !code) {
        vscode.window.showErrorMessage("No code to review");
        return;
      }

      let completion: CompletionModelResponse | undefined;

      vscode.window
        .withProgress(
          {
            location: vscode.ProgressLocation.Window,
            cancellable: false, // TODO: make this cancellable and use ProgressLocation.Notification
            title: "Reviewing code file",
          },
          async (progress) => {
            progress.report({ increment: 0 });

            completion = await completionModel.complete({
              instruction:
                "You are acting as GitHub Copilot. Return only code. Review the code and fix any bugs, then return the code.",
              code: code,
            });

            progress.report({ increment: 100 });
          },
        )
        .then(async () => {
          if (completion && completion.success) {
            const tempFile = await vscode.workspace.openTextDocument({
              content: completion.completion,
              language: activeEditor.document.languageId,
            });

            vscode.commands.executeCommand(
              "vscode.diff",
              activeEditor.document.uri,
              tempFile.uri,
            );

            return;
          }
          const errorMessage = completion?.errorMessage;
          vscode.window.showErrorMessage(
            errorMessage || "Unknown error occurred during code review",
          );
        });
    },
  );

  const reviewSelectedCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewSelectedCode",
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      const code = activeEditor?.document.getText(activeEditor?.selection);
      if (!activeEditor || !code) {
        vscode.window.showErrorMessage("No code selected to review");
        return;
      }

      let completion: CompletionModelResponse | undefined;

      vscode.window
        .withProgress(
          {
            location: vscode.ProgressLocation.Window,
            cancellable: false, // TODO: make this cancellable and use ProgressLocation.Notification
            title: "Reviewing selected code",
          },
          async (progress) => {
            progress.report({ increment: 0 });

            completion = await completionModel.complete({
              instruction:
                "You are acting as GitHub Copilot. Return only code. Review the code and fix any bugs, then return the code.",
              code: code,
            });

            progress.report({ increment: 100 });
          },
        )
        .then(async () => {
          if (completion && completion.success) {
            const beforeSelection = activeEditor.document.getText(
              new vscode.Range(
                new vscode.Position(0, 0),
                activeEditor.selection.start,
              ),
            );
            const afterSelection = activeEditor.document.getText(
              new vscode.Range(
                activeEditor.selection.end,
                new vscode.Position(
                  activeEditor.document.lineCount - 1,
                  activeEditor.document.lineAt(
                    activeEditor.document.lineCount - 1,
                  ).text.length,
                ),
              ),
            );
            const suggestionTempFile = await vscode.workspace.openTextDocument({
              content: beforeSelection + completion.completion + afterSelection,
              language: activeEditor.document.languageId,
            });

            vscode.commands.executeCommand(
              "vscode.diff",
              activeEditor.document.uri,
              suggestionTempFile.uri,
            );

            return;
          }
          const errorMessage = completion?.errorMessage;
          vscode.window.showErrorMessage(
            errorMessage || "Unknown error occurred during code review",
          );
        });
    },
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(reviewFileCodeCommand);
  context.subscriptions.push(reviewSelectedCodeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
