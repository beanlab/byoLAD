import * as vscode from "vscode";

import { PersonaImportExport } from "../../shared/types";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

export function importPersona(
  persona: PersonaImportExport,
  personaDataManager: PersonaDataManager,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  chatWebviewProvider: ChatWebviewProvider,
) {
  try {
    personaDataManager.addNewPersona(persona);
  } catch (error: unknown) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`Failed Persona import: ${error.message}`);
    }
    return;
  }
  vscode.window.showInformationMessage(
    `Successfully imported new persona "${persona.name}"`,
  );
  if (chatWebviewProvider.isWebviewVisible()) {
    extensionToWebviewMessageSender.refresh();
  }
}
