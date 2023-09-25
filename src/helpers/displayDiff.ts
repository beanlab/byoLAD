import * as vscode from "vscode";
import { TextProviderScheme } from "./types";

/**
 * Displays a diff comparison of the active editor document and the provided content in a new editor.
 *
 * @param diffText Text to compare to the active editor document text
 * @param activeEditor The active editor to compare to the diff text
 */
export async function displayDiff(
  diffText: string | undefined,
  activeEditor: vscode.TextEditor,
) {
  // Using the uri of the document the changes are for in the uri of the document to display the changes in means that
  // the command that applies the proposed changes can find the original document to updatea and apply changes to.
  const uri = vscode.Uri.parse(
    TextProviderScheme.AiCodeReview + ":" + activeEditor.document.fileName,
  );
  const doc = await vscode.workspace.openTextDocument(uri); // calls back into the custom TextDocumentContentProvider for the scheme
  const edit = new vscode.WorkspaceEdit();
  edit.replace(
    uri,
    new vscode.Range(
      new vscode.Position(0, 0),
      doc.lineAt(doc.lineCount - 1).range.end,
    ),
    diffText ?? "",
  );
  await vscode.workspace.applyEdit(edit);

  vscode.commands.executeCommand(
    "vscode.diff",
    activeEditor.document.uri,
    doc.uri,
    activeEditor.document.fileName + " ↔️ " + "AI Suggestions", // TODO: Separate into method / use constants?
  );
}
