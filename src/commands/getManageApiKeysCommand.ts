import * as vscode from "vscode";
import { SecretsProvider } from "../helpers/SecretsProvider";
import { ModelProvider } from "../../shared/types";

/**
 * Command for a Quick Pick to manage API keys for LLM providers.
 */
export const getManageApiKeysCommand = (secretsProvider: SecretsProvider) =>
  vscode.commands.registerCommand(
    "vscode-byolad.manageApiKeys",
    async (modelProvider: ModelProvider | undefined) => {
      if (!modelProvider) {
        modelProvider = await getModelProviderFromUser();
      }
      if (!modelProvider) {
        // User did not select a provider
        return;
      }

      const existingApiKey = await secretsProvider.getApiKey(modelProvider);
      if (existingApiKey) {
        const choices: string[] = ["Set", "Clear"];
        const selection = await vscode.window.showQuickPick(choices, {
          title: `Manage ${modelProvider} API Key`,
        });
        if (!selection) {
          // User did not select an option
          return;
        } else if (selection === "Set") {
          await getAndSetApiKeyFromUser(modelProvider, secretsProvider);
        } else if (selection === "Clear") {
          await clearApiKey(secretsProvider, modelProvider);
        } else {
          await vscode.window.showErrorMessage("Invalid choice");
          return;
        }
      } else {
        await getAndSetApiKeyFromUser(modelProvider, secretsProvider);
      }
    },
  );

async function getModelProviderFromUser(): Promise<ModelProvider | undefined> {
  const modelProviders: string[] = Object.keys(ModelProvider);
  const selectedProviderKey: string | undefined =
    await vscode.window.showQuickPick(modelProviders, {
      title: "Manage LLM Provider API Keys",
      placeHolder: "Select an LLM provider",
    });

  if (!selectedProviderKey) {
    // User did not select a provider
    return;
  }
  if (selectedProviderKey in ModelProvider) {
    return selectedProviderKey as ModelProvider;
  } else {
    return;
  }
}

async function getAndSetApiKeyFromUser(
  modelProvider: ModelProvider,
  secretsProvider: SecretsProvider,
): Promise<void> {
  const apiKey: string | undefined = await getApiKeyFromUser(modelProvider);
  if (!apiKey) {
    // User did not enter a new API key
    return;
  }
  await secretsProvider.setApiKey(modelProvider, apiKey);
  await vscode.window.showInformationMessage(
    `Set API key for ${modelProvider}`,
  );
}

async function getApiKeyFromUser(
  modelProvider: ModelProvider,
): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: `Set API Key for ${modelProvider}`,
  });
}

async function clearApiKey(
  secretsProvider: SecretsProvider,
  provider: ModelProvider,
) {
  await secretsProvider.deleteApiKey(provider);
  await vscode.window.showInformationMessage(`Cleared API key for ${provider}`);
}
