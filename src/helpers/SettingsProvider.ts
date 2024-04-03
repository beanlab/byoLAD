import { ApplyChangesPosition } from "./types";
import * as vscode from "vscode";
import { MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE } from "../commands/constants";
/**
 * Provides access to the user's VS Code settings for the extension.
 */
export class SettingsProvider {
  /**
   * The user's VS Code settings for the extension.
   * This is not automatically updated when the settings change in VS Code.
   */
  private _config: vscode.WorkspaceConfiguration;

  constructor(config: vscode.WorkspaceConfiguration) {
    this._config = config;
  }

  setConfig(config: vscode.WorkspaceConfiguration) {
    this._config = config;
  }

  getReviewCodePrompt(): string {
    return this._config.get("reviewCodePrompt") as string;
  }

  getExplainCodePrompt(): string {
    return this._config.get("explainCodePrompt") as string;
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
