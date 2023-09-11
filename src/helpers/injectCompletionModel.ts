import { CompletionModel } from "../CompletionModel/CompletionModel";
import { GPTCompletionModel } from "../CompletionModel/Implementations/GPTCompletionModel";
import { UnsetCompletionModel } from "../CompletionModel/Implementations/UnsetCompletionModel";
import * as vscode from "vscode";
import { CompletionModelType, MessageSeverity } from "./types";
import { PaLMCompletionModel } from "../CompletionModel/Implementations/PaLMCompletionModel";

const injectUnsetCompletionModel = (
  message: string,
  severity: MessageSeverity,
): UnsetCompletionModel => {
  switch (severity) {
    case MessageSeverity.Error:
      vscode.window.showErrorMessage(message);
      break;
    case MessageSeverity.Warning:
      vscode.window.showWarningMessage(message);
      break;
    case MessageSeverity.Info:
      vscode.window.showInformationMessage(message);
      break;
  }
  return new UnsetCompletionModel(message);
};

const injectGPTCompletionModel = ():
  | GPTCompletionModel
  | UnsetCompletionModel => {
  const config = vscode.workspace.getConfiguration("vs-code-ai-extension");
  const apiKey = config.get("APIKey") as string;

  if (apiKey) return new GPTCompletionModel(apiKey);

  return injectUnsetCompletionModel(
    "vs-code-ai-extension: APIKey not set",
    MessageSeverity.Warning,
  );
};

const injectPaLMCompletionModel = ():
  | PaLMCompletionModel
  | UnsetCompletionModel => {
  const config = vscode.workspace.getConfiguration("vs-code-ai-extension");
  const apiKey = config.get("APIKey") as string;

  if (apiKey) return new PaLMCompletionModel(apiKey);

  return injectUnsetCompletionModel(
    "vs-code-ai-extension: APIKey not set",
    MessageSeverity.Warning,
  );
};

export const injectCompletionModel = (): CompletionModel => {
  const config = vscode.workspace.getConfiguration("vs-code-ai-extension");
  const model = config.get("model") as CompletionModelType;

  switch (model) {
    case CompletionModelType.GPT3:
      return injectGPTCompletionModel();
    case CompletionModelType.PaLM:
      return injectPaLMCompletionModel();
    default:
      return injectUnsetCompletionModel(
        "vs-code-ai-extension: Model not set",
        MessageSeverity.Warning,
      );
  }
};
