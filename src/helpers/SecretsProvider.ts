import * as vscode from "vscode";
import { ModelProvider } from "../../shared/types";

/**
 * Provides access to the secure secrets storage.
 */
export class SecretsProvider {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  async setApiKey(provider: ModelProvider, apiKey: string): Promise<void> {
    await this.context.secrets.store(
      `apiKey:${ModelProvider[provider]}`,
      apiKey,
    );
  }

  async getApiKey(provider: ModelProvider): Promise<string | undefined> {
    return await this.context.secrets.get(`apiKey:${ModelProvider[provider]}`);
  }

  async deleteApiKey(provider: ModelProvider): Promise<void> {
    await this.context.secrets.delete(`apiKey:${ModelProvider[provider]}`);
  }
}
