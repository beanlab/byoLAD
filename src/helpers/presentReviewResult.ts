import * as vscode from "vscode";
import { ApplySuggestionsMode } from "./types";
import { NOT_IMPLEMENTED_ERROR_MESSAGE } from "../commands/constants";
import { SettingsProvider } from "./SettingsProvider";
import { replaceTextAndCompare } from "./replaceTextAndCompare";
import { displayDiffPreview } from ".";

/**
 * Presents the reviewed code to the user according to their settings for applying the suggested changes.
 *
 * @param newDocText The text of the document after the suggested changes have been applied.
 * @param activeEditor The active editor.
 * @param settingsProvider The extension settings provider.
 */
export async function presentReviewResult(
  newDocText: string | undefined,
  activeEditor: vscode.TextEditor,
  settingsProvider: SettingsProvider,
) {
  if (
    settingsProvider.getApplySuggestionsMode() == ApplySuggestionsMode.Manual
  ) {
    await displayDiffPreview(newDocText, activeEditor);
  } else if (
    settingsProvider.getApplySuggestionsMode() == ApplySuggestionsMode.Auto
  ) {
    await replaceTextAndCompare(newDocText, activeEditor);
  } else {
    vscode.window.showErrorMessage(NOT_IMPLEMENTED_ERROR_MESSAGE);
  }
}
