// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { injectCompletionModel } from "./helpers/injectCompletionModel";

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

  const reviewCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewCode",
    async () => {
      vscode.window.showInformationMessage("Reviewing Code");
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No code to review");
        return;
      }
      const code = activeEditor.document.getText();
      const completion = await completionModel.complete({
        instruction:
          "You are acting as GitHub Copilot. Return only code. Review the code and fix any bugs, then return the code.",
        code: code,
      });
      if (completion.success) {
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
      const errorMessage = completion.errorMessage;
      vscode.window.showErrorMessage(
        errorMessage || "Unknown error occurred during code review",
      );
    },
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(reviewCodeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
