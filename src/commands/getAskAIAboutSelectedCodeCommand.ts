import * as vscode from "vscode";
import { doCompletion } from "../helpers";
import { SettingsProvider } from "../helpers/SettingsProvider";

export const getAskAIAboutSelectedCodeCommand = (
  settingsProvider: SettingsProvider,
): vscode.Disposable => {
  return vscode.commands.registerCommand(
    "vs-code-ai-extension.askAIAboutSelectedCode",
    async () => {
      const code = vscode.window.activeTextEditor?.document.getText(
        vscode.window.activeTextEditor?.selection,
      );

      const userPrompt = "What would you like to ask the AI?"; // TODO: Move to constants file
      const userInvalidInputMessage = "Please enter a question/request."; // TODO: Move to constants file

      // multi-line user input
      const userRequest = await vscode.window.showInputBox({
        prompt: userPrompt,
        value: "",
        valueSelection: [0, 0],
        ignoreFocusOut: true,
        validateInput: (text) => {
          return text ? null : userInvalidInputMessage;
        },
      });

      if (!userRequest) {
        return;
      }

      const modelInstruction = userRequest;
      const progressTitle = "Asking the AI for its wisdom..."; // TODO: Move to constants file

      doCompletion(
        settingsProvider.getCompletionModel(),
        code,
        modelInstruction,
        progressTitle,
        (completion, activeEditor) => {
          console.log(activeEditor.document.languageId); // TODO: Refactor so this isn't needed. Only here to use the variable.
          if (!completion.completion) {
            vscode.window.showInformationMessage("No response from the AI.");
            return;
          }
          vscode.workspace
            .openTextDocument({
              content: completion.completion,
              language: "plaintext",
            })
            .then((doc) => {
              vscode.window.showTextDocument(doc, {
                preview: false,
                preserveFocus: false,
                viewColumn: vscode.ViewColumn.Beside,
              });
            });
        },
      );
    },
  );
};
