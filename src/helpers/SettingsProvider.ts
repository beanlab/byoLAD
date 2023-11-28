import { ApplyChangesPosition, LLMProvider } from "./types";
import { injectChatModel } from "./injectChatModel";
import * as vscode from "vscode";
import { MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE } from "../commands/constants";
import { ChatModel } from "../ChatModel/ChatModel";

export class SettingsProvider {
  private _chatModel: ChatModel;
  private _config: vscode.WorkspaceConfiguration;

  constructor(config: vscode.WorkspaceConfiguration) {
    this._config = config;
    this._chatModel = injectChatModel(
      this.getProvider(),
      this.getModel(),
      this.getAPIKey(),
    );
    this._chatModel = injectChatModel(
      this.getProvider(),
      this.getModel(),
      this.getAPIKey(),
    );
  }

  getChatModel(): ChatModel {
    return this._chatModel;
  }

  setConfig(config: vscode.WorkspaceConfiguration) {
    this._config = config;
    this._chatModel = injectChatModel(
      this.getProvider(),
      this.getModel(),
      this.getAPIKey(),
    );
  }

  getBasePromptInstruction(): string {
    return this._config.get("basePromptInstruction") as string;
  }

  getReviewCodePrompt(): string {
    return this._config.get("reviewCodePrompt") as string;
  }

  getExplainCodePrompt(): string {
    return this._config.get("explainCodePrompt") as string;
  }

  getAPIKey(): string {
    return this._config.get("APIKey") as string;
  }

  getModel(): string {
    return this._config.get("model") as string;
  }

  getProvider(): LLMProvider {
    return this._config.get("provider") as LLMProvider;
  }

  /**
   * Gets the position to show the diff view in. If the user has selected "Use Merge Conflict Setting", then
   * this method will get the merge-conflict.diffViewPosition setting and use that. If that setting is not
   * set or is invalid, then the user will be shown an error message and the position will default to "Below".
   *
   * @returns The position to show the diff view in.
   */
  getDiffViewPosition(): ApplyChangesPosition {
    let position = this._config.get(
      "applySuggestions.diffViewPosition",
    ) as ApplyChangesPosition;
    if (position === ApplyChangesPosition.UseMergeConflictSetting) {
      const mergeConflictDiffViewPosition = vscode.workspace
        .getConfiguration("merge-conflict")
        .get<string>("diffViewPosition");
      if (
        mergeConflictDiffViewPosition &&
        mergeConflictDiffViewPosition in ApplyChangesPosition
      ) {
        position = mergeConflictDiffViewPosition as ApplyChangesPosition;
      } else {
        vscode.window.showErrorMessage(
          MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE,
        );
        const defaultPosition = ApplyChangesPosition.Below;
        position = defaultPosition;
      }
    }
    return position;
  }
}
