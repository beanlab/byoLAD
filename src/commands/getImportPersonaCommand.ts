import * as vscode from "vscode";

import { PersonaImportExport } from "../../shared/types";
import { getUserPersonaImportFile } from "../helpers";
import { importPersona } from "../helpers/importPersona";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

export const getImportPersonaCommand = (
  personaDataManager: PersonaDataManager,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  chatWebviewProvider: ChatWebviewProvider,
) =>
  vscode.commands.registerCommand("vscode-byolad.importPersona", async () => {
    const persona: PersonaImportExport | undefined =
      await getUserPersonaImportFile();
    if (persona) {
      importPersona(
        persona,
        personaDataManager,
        extensionToWebviewMessageSender,
        chatWebviewProvider,
      );
    }
  });
