// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { injectCompletionModel } from "./helpers/injectCompletionModel";
import { CompletionModelResponse } from "./CompletionModel/CompletionModel";

const codeReviewInstruction =
  "You are acting as GitHub Copilot. Return only code. Review the code and fix any bugs, then return the code.";
const codeReviewProgressTitle = "Reviewing code";

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

  // For commands that have been defined in the package.json file,
  // provide the implementation with registerCommand.
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

  /**
   * Queries the model for a reviewed, edited version of the current file contents. Displays a diff of the active editor document and the completion response.
   */
  const reviewFileCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewFileCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText();
      const modelInstruction = codeReviewInstruction;
      const progressTitle = codeReviewProgressTitle;

      getCompletion(
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) =>
          displayDiff(completion.completion, activeEditor),
      );
    },
  );

  /**
   * Queries the model for a reviewed, edited version of the currently selected code. Displays a diff of the active editor document and the completion response in context of the overall file.
   */
  const reviewSelectedCodeCommand = vscode.commands.registerCommand(
    "vs-code-ai-extension.reviewSelectedCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection,
      );
      const modelInstruction = codeReviewInstruction;
      const progressTitle = codeReviewProgressTitle;

      getCompletion(
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) => {
          const documentTextBeforeSelection = activeEditor.document.getText(
            new vscode.Range(
              new vscode.Position(0, 0),
              activeEditor.selection.start,
            ),
          );
          const documentTextAfterSelection = activeEditor.document.getText(
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

          const diffContent =
            documentTextBeforeSelection +
            completion.completion +
            documentTextAfterSelection;
          displayDiff(diffContent, activeEditor);
        },
      );
    },
  );

  /**
   * Displays a diff of the active editor document and the provided content in a new editor.
   *
   * @param diffText Text to compare to the active editor document text
   * @param activeEditor The active editor to compare to the diff text
   */
  async function displayDiff(
    diffText: string | undefined,
    activeEditor: vscode.TextEditor,
  ) {
    const tempFile = await vscode.workspace.openTextDocument({
      content: diffText ?? "",
      language: activeEditor.document.languageId,
    });

    vscode.commands.executeCommand(
      "vscode.diff",
      activeEditor.document.uri,
      tempFile.uri,
    );
  }

  /**
   * Gets a completion from the model given code and instructions, and handles the response.
   * Checks for input/response errors along the way. Handles a failed completion response.
   *
   * @param code The code to act on in the completion model
   * @param instruction The instructions for the completion model
   * @param handleResponse The function to handle a successful response from the completion model
   */
  function getCompletion(
    code: string | undefined,
    instruction: string,
    progressTitle: string,
    handleResponse: (
      completion: CompletionModelResponse,
      activeEditor: vscode.TextEditor,
    ) => void,
  ) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      vscode.window.showErrorMessage("No active editor");
      return;
    }
    if (!code) {
      vscode.window.showErrorMessage("No input code");
      return;
    }

    let completion: CompletionModelResponse | undefined;
    vscode.window
      .withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          cancellable: false, // TODO: make this cancellable (or have a configurable timeout or something)
          title: progressTitle,
        },
        async () => {
          completion = await completionModel.complete({
            instruction: instruction,
            code: code,
          });
        },
      )
      .then(async () => {
        if (completion && completion.success && completion.completion) {
          handleResponse(completion, activeEditor);
          return;
        }
        if (!completion) {
          vscode.window.showErrorMessage("No response from completion model");
        } else {
          vscode.window.showErrorMessage(
            completion?.errorMessage ||
              "Unknown error occurred while getting completion",
          );
        }
      });
  }

  // Add the commands to the extension context so they can be used
  context.subscriptions.push(disposable);
  context.subscriptions.push(reviewFileCodeCommand);
  context.subscriptions.push(reviewSelectedCodeCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
