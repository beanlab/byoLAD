import * as vscode from "vscode";
import { ModelProvider } from "../../shared/types";
import { SecretsProvider } from "./SecretsProvider";

export async function getAndStoreUserApiKey(
  modelProvider: ModelProvider,
  secretsProvider: SecretsProvider,
): Promise<string | undefined> {
  const apiKey = await vscode.window.showInputBox({
    placeHolder: "Enter API Key",
    prompt: `Enter API Key for ${modelProvider}`,
    validateInput: (value) => (value ? undefined : "API Key is required"),
  });

  if (apiKey) {
    await secretsProvider.setApiKey(modelProvider, apiKey);
  }

  return apiKey;
}
