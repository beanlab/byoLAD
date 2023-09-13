import * as vscode from "vscode";
import { TextProviderScheme } from "./types";

/**
 * Using the defined code review scheme, returns a disposable object that can be used to register a text document content provider.
 * This TextDocumentContentProvider returns an empty file, as the caller must then provide its contents.
 *
 * @returns An object that can be used to register a text document content provider for the defined code review scheme.
 */
export const getReviewCodeTextDocumentContentProvider =
  (): vscode.Disposable => {
    return vscode.workspace.registerTextDocumentContentProvider(
      TextProviderScheme.AiCodeReview,
      new (class implements vscode.TextDocumentContentProvider {
        provideTextDocumentContent(): string {
          return "";
        }
      })(),
    );
  };
