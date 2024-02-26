import * as vscode from "vscode";
import { PersonaDataManager } from "../Persona/PersonaDataManager";
import { Persona } from "../../shared/types";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

/**
 * Returns a command that allows the user to manage their custom Personas.
 */
export const getManagePersonasCommand = (
  personaDataManager: PersonaDataManager,
  extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
): vscode.Disposable =>
  vscode.commands.registerCommand("vscode-byolad.managePersonas", async () => {
    // Step 1: User selects persona (or inputs a name for a new persona)
    const personaPickResult: string | vscode.QuickPickItem | undefined =
      await pickPersona(
        personaDataManager.customPersonas,
        () => personaDataManager.clearAllCustomPersonas(),
        (name) => personaDataManager.validateNewPersonaName(name),
      );

    if (personaPickResult) {
      // Step 2: User edits the instructions for the persona (or inputs new instructions for a new persona)
      let initialInstructionsValue: string | undefined;
      const personaName: string =
        (personaPickResult as vscode.QuickPickItem).label ||
        (personaPickResult as string);
      const existingPersona = personaDataManager.getPersonaByName(personaName);
      if (existingPersona) {
        initialInstructionsValue = existingPersona.instructions;
      }
      const newInstructions = await getInstructionsInput(
        personaName,
        initialInstructionsValue,
      );

      // Persona updated or created if instructions are provided
      if (newInstructions) {
        if (existingPersona) {
          personaDataManager.updatePersonaInstructions(
            existingPersona.id,
            newInstructions,
          );
          vscode.window.showInformationMessage(
            `Updated Persona: ${personaName}`,
          );
        } else {
          personaDataManager.addNewPersona(personaName, newInstructions);
          vscode.window.showInformationMessage(
            `Created Persona: ${personaName}`,
          );
        }
        await extensionToWebviewMessageSender.refresh();
      }
    }
  });

/**
 * Prompts the user to select a Persona from the list of existing Personas or to create a new one.
 * @param personas The list of existing Personas to pick from.
 * @param validateNewPersonaName Function to validate the new persona name. Throws an error if the name is invalid.
 * @returns The name of the selected Persona or undefined if the user cancels the selection or deletes all custom Personas.
 */
const pickPersona = async (
  personas: Persona[],
  clearAllCustomPersonas: () => void,
  validateNewPersonaName: (name: string) => void,
): Promise<string | vscode.QuickPickItem | undefined> => {
  const newItemLabel = "Create new Persona";
  const clearAllLabel = "Delete all custom Personas";
  const items: vscode.QuickPickItem[] = [
    { kind: vscode.QuickPickItemKind.Separator, label: "New" },
    { label: newItemLabel, alwaysShow: true },
    { kind: vscode.QuickPickItemKind.Separator, label: "Existing" },
    ...personas.map((persona) => ({ label: persona.name })),
    { kind: vscode.QuickPickItemKind.Separator, label: "Delete" },
    { label: clearAllLabel },
  ];

  const pick = await vscode.window.showQuickPick(items, {
    title: "Manage Custom Personas",
    placeHolder: "Select an existing persona or create a new one",
  } as vscode.QuickPickOptions);

  if (pick) {
    if (pick.label === newItemLabel) {
      // User is creating a new Persona
      const newPersonaName: string | undefined =
        await vscode.window.showInputBox({
          prompt: "Provide a short, unique name for the new Persona",
          validateInput: (name) => {
            try {
              validateNewPersonaName(name);
              return undefined; // is valid
            } catch (error) {
              return (error as Error).message;
            }
          },
        });

      if (newPersonaName) {
        // User is editing an existing Persona
        return newPersonaName;
      }
    } else if (pick.label === clearAllLabel) {
      // User is deleting all custom Personas
      const confirmed = await askForConfirmation(
        "Are you sure you want to delete all custom Personas? This action cannot be undone.",
      );
      if (confirmed) {
        clearAllCustomPersonas();
        vscode.window.showInformationMessage("Deleted all custom Personas");
        return undefined;
      }
    } else {
      return pick;
    }
  }
};

/**
 * Prompts the user to input/edit the base instructions for the Persona.
 * @param initialInstructionsValue The initial value for the input box.
 * @returns The new instructions or null if the user cancels the input.
 */
async function getInstructionsInput(
  personaName: string,
  initialInstructionsValue: string | undefined,
): Promise<string | null> {
  return (
    (await vscode.window.showInputBox({
      title: `${personaName}: Instructions`,
      prompt: `Enter the base instructions for the Persona: ${personaName}`,
      value: initialInstructionsValue,
    })) ?? null
  );
}

/**
 * Prompts the user to confirm an action.
 * @param message The message to display to the user.
 * @returns True if the user confirms the action, false otherwise.
 */
async function askForConfirmation(message: string): Promise<boolean> {
  const selection = await vscode.window.showQuickPick(["Yes", "No"], {
    placeHolder: message,
  });

  return selection === "Yes";
}
