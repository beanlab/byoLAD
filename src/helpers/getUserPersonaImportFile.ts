import * as fs from "fs";
import * as vscode from "vscode";

import { PersonaImportExport } from "../../shared/types";

export async function getUserPersonaImportFile(): Promise<
  PersonaImportExport | undefined
> {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Import Persona",
    filters: {
      JSON: ["json"],
    },
  };

  const fileUri = await vscode.window.showOpenDialog(options);
  if (fileUri && fileUri[0]) {
    const filePath = fileUri[0].fsPath;
    const fileContent = fs.readFileSync(filePath, "utf8");
    try {
      const personaImportExport: PersonaImportExport = JSON.parse(fileContent);
      return personaImportExport;
    } catch (error: unknown) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(
          `Failed to import Persona: ${error.message}`,
        );
      }
    }
  }
  return undefined;
}
