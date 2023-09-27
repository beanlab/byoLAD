import * as vscode from "vscode";
import { ApplySuggestionsMode, TextProviderScheme } from "./types";
import {
  DIFF_VIEW_TITLE_SUFFIX_AUTO_MODE,
  DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE,
  NOT_IMPLEMENTED_ERROR_MESSAGE,
} from "../commands/constants";
import { SettingsProvider } from "./SettingsProvider";

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
  const activeDoc = activeEditor.document;
  const originalDocPath = activeDoc.uri.path;
  const originalFileName = originalDocPath.substring(
    originalDocPath.lastIndexOf("/") + 1,
  );
  const applySuggestionsMode = settingsProvider.getApplySuggestionsMode();
  if (
    applySuggestionsMode != ApplySuggestionsMode.Auto &&
    applySuggestionsMode != ApplySuggestionsMode.Manual
  ) {
    vscode.window.showErrorMessage(NOT_IMPLEMENTED_ERROR_MESSAGE);
    return;
  }

  const virtualComparisonDoc = await getVirtualComparisonDoc(
    newDocText,
    activeDoc,
    applySuggestionsMode,
  );

  if (applySuggestionsMode == ApplySuggestionsMode.Auto) {
    await applySuggestions(activeDoc, newDocText);
  }

  const title = getTitle(originalFileName, applySuggestionsMode);
  const opts: vscode.TextDocumentShowOptions = {
    viewColumn: vscode.ViewColumn.Active, // TODO: How to handle this setting? Configurable?
  };

  await vscode.commands.executeCommand("workbench.action.newGroupBelow"); // TODO: Make this configurable like in 'merge-conflict' getConfig --> mergeConflictConfig.get<string>('diffViewPosition') or just use that config setting anyway
  await vscode.commands.executeCommand(
    "vscode.diff",
    virtualComparisonDoc.uri,
    activeDoc.uri,
    title,
    opts,
  );
}

/**
 * Gets the virtual document to compare to the active editor document based on the apply suggestions mode.
 * If the apply suggestions mode is manual, the virtual document will be created with the provided (suggestion) text.
 * If the apply suggestions mode is auto, the virtual document will be created with the active editor document text.
 * Assumes the apply suggestions mode is one of those two.
 *
 * @param newDocText Suggested text to be used in the virtual document in manual mode
 * @param activeDoc The active editor document (whose text is used in the virtual document in auto mode)
 * @param applySuggestionsMode The apply suggestions mode
 * @returns The virtual document to compare to the active editor document
 */
async function getVirtualComparisonDoc(
  newDocText: string | undefined,
  activeDoc: vscode.TextDocument,
  applySuggestionsMode: ApplySuggestionsMode,
) {
  if (applySuggestionsMode == ApplySuggestionsMode.Manual) {
    return await createVirtualDoc(newDocText, activeDoc.fileName);
  } else {
    return await createVirtualDoc(activeDoc.getText(), activeDoc.fileName);
  }
}

/**
 * Gets the title for the diff view based on the original file name and the apply suggestions mode.
 * Assumes the apply suggestions mode is auto or manual.
 *
 * @param originalFileName Name of the original file
 * @param applySuggestionsMode The apply suggestions mode
 * @returns The title for the diff view
 */
function getTitle(
  originalFileName: string,
  applySuggestionsMode: ApplySuggestionsMode,
) {
  if (applySuggestionsMode == ApplySuggestionsMode.Manual) {
    return originalFileName + DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE;
  } else {
    return originalFileName + DIFF_VIEW_TITLE_SUFFIX_AUTO_MODE;
  }
}

/**
 * Creates a virtual document with the provided text.
 * Using the uri of 'the document the changes are for' in the 'uri of the document to display
 * the changes in' gives us control over the context in which they are displayed.
 *
 * @param textContent The desired text content of the virtual document
 * @param originalDocFileName The file name of the document the document is based on
 * @returns The virtual document with the provided text content
 */
async function createVirtualDoc(
  textContent: string | undefined,
  originalDocFileName: string,
) {
  const uri = vscode.Uri.parse(
    TextProviderScheme.AiCodeReview + ":" + originalDocFileName,
  );
  const virtualDoc = await vscode.workspace.openTextDocument(uri); // calls back into the custom TextDocumentContentProvider for the scheme
  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    uri,
    new vscode.Range(
      new vscode.Position(0, 0),
      virtualDoc.lineAt(virtualDoc.lineCount - 1).range.end,
    ),
    textContent ?? "",
  );
  await vscode.workspace.applyEdit(edit);
  return virtualDoc;
}

/**
 * Applies the provided suggestions to the active editor document.
 *
 * @param activeDoc The active editor document to apply the suggestions to
 * @param newDocText The text to apply to the active editor document
 */
async function applySuggestions(
  activeDoc: vscode.TextDocument,
  newDocText: string | undefined,
) {
  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    activeDoc.uri,
    new vscode.Range(
      new vscode.Position(0, 0),
      activeDoc.lineAt(activeDoc.lineCount - 1).range.end,
    ),
    newDocText ?? "",
  );
  await vscode.workspace.applyEdit(edit);
}
