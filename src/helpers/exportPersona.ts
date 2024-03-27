import * as vscode from "vscode";

import { PersonaImportExport } from "../../shared/types";
import { PersonaDataManager } from "../Persona/PersonaDataManager";

/**
 * Exports a persona to a JSON file, omitting the ID.
 * @param personaId
 * @param personaDataManager
 * @returns
 */
export async function exportPersona(
  personaId: number,
  personaDataManager: PersonaDataManager,
) {
  const persona = personaDataManager.getPersonaById(personaId);
  if (!persona) {
    vscode.window.showErrorMessage(
      `Failed to export persona: Persona with ID ${personaId} not found`,
    );
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...dataToExport } = persona;
  const personaExportImport: PersonaImportExport = dataToExport;

  const doc = await vscode.workspace.openTextDocument({
    language: "json",
    content: JSON.stringify(personaExportImport, null, 2),
  });

  if (await doc.save()) {
    vscode.window.showInformationMessage(
      `Successfully exported persona "${persona.name}"`,
    );
  } else {
    vscode.window.showErrorMessage(
      `Failed to export persona "${persona.name}"`,
    );
  }
}
