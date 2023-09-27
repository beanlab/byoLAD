import * as vscode from "vscode";
import { TextProviderScheme } from "./types";
import { DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE } from "../commands/constants";

/**
 * Displays a diff comparison of the active editor document and the provided content in a new editor
 * so that specific changes can be applied to the active editor document manually.
 * Use of vscode.diff command based heavily on https://github.com/microsoft/vscode/blob/50573340ab343ddfe9756e3cbc3e7da556206fb6/extensions/merge-conflict/src/commandHandler.ts#L85C9-L85C9
 *
 * @param diffText Text to compare to the active editor document text
 * @param activeEditor The active editor to compare to the diff text
 */
export async function displayDiffPreview(
  diffText: string | undefined,
  activeEditor: vscode.TextEditor,
) {
  const originalDoc = activeEditor.document;
  const originalDocPath = originalDoc.uri.path;
  const originalFileName = originalDocPath.substring(
    originalDocPath.lastIndexOf("/") + 1,
  );

  const suggestionDoc = await getVirtualEditedSuggestionDoc(
    diffText,
    activeEditor.document.fileName,
  );

  const title = originalFileName + DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE;
  const opts: vscode.TextDocumentShowOptions = {
    viewColumn: vscode.ViewColumn.Active, // TODO: How to handle this setting? Configurable?
  };

  await vscode.commands.executeCommand("workbench.action.newGroupBelow"); // TODO: Make this configurable like in 'merge-conflict' getConfig --> mergeConflictConfig.get<string>('diffViewPosition') or just use that config setting anyway
  await vscode.commands.executeCommand(
    "vscode.diff",
    suggestionDoc.uri,
    originalDoc.uri,
    title,
    opts,
  );
}

/**
 * Creates a virtual document with the provided diff text.
 * Using the uri of 'the document the changes are for' in the 'uri of the documentto display
 * the changes in' gives us control over the context in which they are displayed.
 *
 * @param diffText The text to display in the virtual document
 * @param originalDocFileName The file name of the document the changes are for
 * @returns The virtual document with the provided diff text
 */
async function getVirtualEditedSuggestionDoc(
  diffText: string | undefined,
  originalDocFileName: string,
) {
  const uri = vscode.Uri.parse(
    TextProviderScheme.AiCodeReview + ":" + originalDocFileName,
  );
  const suggestionDoc = await vscode.workspace.openTextDocument(uri); // calls back into the custom TextDocumentContentProvider for the scheme
  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    uri,
    new vscode.Range(
      new vscode.Position(0, 0),
      suggestionDoc.lineAt(suggestionDoc.lineCount - 1).range.end,
    ),
    diffText ?? "",
  );
  await vscode.workspace.applyEdit(edit);
  return suggestionDoc;
}
