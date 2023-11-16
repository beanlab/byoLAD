import * as vscode from "vscode";
import { ApplyChangesPosition, TextProviderScheme } from "./types";
import { DIFF_VIEW_TITLE_SUFFIX } from "../commands/constants";
import { SettingsProvider } from "./SettingsProvider";

/**
 * Presents the reviewed code to the user according to their settings for applying the suggested changes.
 * Use of vscode.diff command based heavily on https://github.com/microsoft/vscode/blob/50573340ab343ddfe9756e3cbc3e7da556206fb6/extensions/merge-conflict/src/commandHandler.ts#L85C9-L85C9
 *
 * @param newDocText The text of the document after the suggested changes have been applied.
 * @param activeEditor The active editor.
 * @param settingsProvider The extension settings provider.
 */
export async function displayDiff(
  newDocText: string | undefined,
  activeEditor: vscode.TextEditor,
  settingsProvider: SettingsProvider,
) {
  const activeDoc = activeEditor.document;
  const originalDocPath = activeDoc.uri.path;
  const originalFileName = originalDocPath.substring(
    originalDocPath.lastIndexOf("/") + 1,
  );

  const virtualComparisonDoc = await createVirtualDoc(
    newDocText,
    activeDoc.fileName,
  );

  const title = originalFileName + DIFF_VIEW_TITLE_SUFFIX;
  const diffViewPosition = settingsProvider.getDiffViewPosition();
  const opts: vscode.TextDocumentShowOptions = {
    viewColumn:
      diffViewPosition === ApplyChangesPosition.Beside
        ? vscode.ViewColumn.Beside
        : vscode.ViewColumn.Active,
  };

  if (diffViewPosition === ApplyChangesPosition.Below) {
    await vscode.commands.executeCommand("workbench.action.newGroupBelow");
  }

  await vscode.commands.executeCommand(
    "vscode.diff",
    virtualComparisonDoc.uri,
    activeDoc.uri,
    title,
    opts,
  );
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
