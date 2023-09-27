import { CompletionModel } from "../CompletionModel/CompletionModel";
import { ApplySuggestionsMode, CompletionProviderType } from "./types";
import { injectCompletionModel } from "./injectCompletionModel";
import * as vscode from "vscode";

export class SettingsProvider {
  private _completionModel: CompletionModel;
  private _config: vscode.WorkspaceConfiguration;

  constructor(config: vscode.WorkspaceConfiguration) {
    this._config = config;
    this._completionModel = injectCompletionModel(
      this.getProvider(),
      this.getModel(),
      this.getAPIKey(),
    );
  }

  getCompletionModel(): CompletionModel {
    return this._completionModel;
  }

  setConfig(config: vscode.WorkspaceConfiguration) {
    this._config = config;
    this._completionModel = injectCompletionModel(
      this.getProvider(),
      this.getModel(),
      this.getAPIKey(),
    );
  }

  getReviewFileCodePrompt(): string {
    return this._config.get("reviewFileCodePrompt") as string;
  }

  getReviewSelectedCodePrompt(): string {
    return this._config.get("reviewSelectedCodePrompt") as string;
  }

  getAPIKey(): string {
    return this._config.get("APIKey") as string;
  }

  getModel(): string {
    return this._config.get("model") as string;
  }

  getProvider(): CompletionProviderType {
    return this._config.get("provider") as CompletionProviderType;
  }

  getApplySuggestionsMode(): ApplySuggestionsMode {
    return this._config.get("applySuggestions.mode") as ApplySuggestionsMode;
  }
}
