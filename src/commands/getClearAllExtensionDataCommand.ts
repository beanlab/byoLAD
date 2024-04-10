import * as vscode from "vscode";

import { ChatDataManager } from "../Chat/ChatDataManager";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { ChatWebviewProvider } from "../webview/ChatWebviewProvider";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

export const getClearAllExtensionDataCommand = (
  chatDataManager: ChatDataManager,
  personaDataManager: PersonaDataManager,
  chatWebviewProvider: ChatWebviewProvider,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
) =>
  vscode.commands.registerCommand(
    "vscode-byolad.clearAllExtensionData",
    async () => {
      const CLEAR_DATA_MESSAGE = "Yes, clear data";
      const CANCEL_MESSAGE = "No, cancel";
      const items = [CLEAR_DATA_MESSAGE, CANCEL_MESSAGE];
      const userChoice: string | undefined = await vscode.window.showQuickPick(
        items,
        {
          title:
            "Clear all chat history and custom persona data? This action cannot be undone.",
        },
      );

      if (!userChoice) {
        // User did not select an option
        return;
      }

      if (userChoice === CLEAR_DATA_MESSAGE) {
        chatDataManager.clearData();
        personaDataManager.clearData();
        vscode.window.showInformationMessage(
          "Chat history and custom persona data cleared successfully.",
        );
        if (chatWebviewProvider.isWebviewVisible()) {
          await extensionToWebviewMessageSender.refresh();
        }
        await showApiKeysWarning();
      }
    },
  );

async function showApiKeysWarning() {
  const errorMessage =
    "Stored API keys have not been cleared, but you can do that manually.";
  const action = "Manage API Keys";
  const result = await vscode.window.showWarningMessage(errorMessage, action);
  if (result === action) {
    await vscode.commands.executeCommand("vscode-byolad.manageApiKeys");
  }
}
