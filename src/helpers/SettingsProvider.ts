import { CompletionModel } from "../CompletionModel/CompletionModel";
import { CompletionModelType } from "./types";
import { injectCompletionModel } from "./injectCompletionModel";
import * as vscode from "vscode";

export class SettingsProvider {
  private _completionModel: CompletionModel;
  private _config: vscode.WorkspaceConfiguration;

  constructor(config: vscode.WorkspaceConfiguration) {
    this._config = config;
    this._completionModel = injectCompletionModel(
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

  getModel(): CompletionModelType {
    return this._config.get("model") as CompletionModelType;
  }
}
