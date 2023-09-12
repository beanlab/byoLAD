import * as vscode from "vscode";
import { CompletionModelProvider } from "../CompletionModel/CompletionModelProvider";
import { injectCompletionModel } from "./injectCompletionModel";

export const getOnDidChangeConfigurationHandler = (
  completionModelProvider: CompletionModelProvider,
): vscode.Disposable => {
  return vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      event.affectsConfiguration("vs-code-ai-extension.model") ||
      event.affectsConfiguration("vs-code-ai-extension.APIKey")
    ) {
      completionModelProvider.setCompletionModel(injectCompletionModel());
    }
  });
};
