import { ExtensionContext } from "vscode";
import { Persona } from "../../shared/types";
import { STANDARD_PERSONAS } from "./StandardPersonas";

/**
 * Manages a user's custom Personas in the VS Code workspace state.
 * Retrieval always includes the standard Personas (which themselves are not stored in the workspace state).
 */
export class PersonaDataManager {
  private readonly PERSONAS_CUSTOM_KEY = "personas";
  private readonly PERSONAS_NEXT_ID_KEY = "personasNextId";
  private readonly PERSONAS_DEFAULT_ID_KEY = "personasDefaultId";
  private readonly context: ExtensionContext;

  constructor(context: ExtensionContext) {
    this.context = context;

    // Initial checks and setup
    if (!STANDARD_PERSONAS.length) {
      throw new Error("Standard Personas cannot be empty");
    }
    const defaultId = this.context.workspaceState.get(
      this.PERSONAS_DEFAULT_ID_KEY,
    );
    if (defaultId === undefined) {
      this.defaultPersonaId = STANDARD_PERSONAS[0].id;
    }
  }

  /**
   * All Personas, including standard and custom Personas saved in the workspace state.
   * Checks for and purges any duplicate IDs, persisting the changes to the workspace state as well.
   */
  get personas(): Persona[] {
    const customPersonas =
      this.context.workspaceState.get<Persona[]>(this.PERSONAS_CUSTOM_KEY) ||
      [];
    return [...STANDARD_PERSONAS, ...customPersonas];
  }

  /**
   * Sets all Personas. Standard Personas included are not saved in the workspace state.
   * Throws an error if there are duplicate IDs.
   */
  set personas(value: Persona[]) {
    if (hasDuplicateIds(value)) {
      throw new Error("Duplicate Persona IDs");
    }

    this.context.workspaceState.update(
      this.PERSONAS_CUSTOM_KEY,
      value.filter(
        (persona) => !STANDARD_PERSONAS.some((sp) => sp.id === persona.id),
      ),
    );
  }

  /**
   * ID of the Persona to be used in newly created Chats.
   */
  get defaultPersonaId(): number {
    const defaultId = this.context.workspaceState.get<number>(
      this.PERSONAS_DEFAULT_ID_KEY,
    );
    if (defaultId) {
      return defaultId;
    } else {
      throw new Error("Default Persona ID not set");
    }
  }

  /**
   * Sets the default Persona ID in the workspace state.
   * Throws an error if the ID does not exist.
   */
  set defaultPersonaId(value: number) {
    if (!this.personas.some((persona) => persona.id === value)) {
      throw new Error("Persona ID does not exist");
    }
    this.context.workspaceState.update(this.PERSONAS_DEFAULT_ID_KEY, value);
  }

  get nextId(): number {
    return (
      this.context.workspaceState.get<number>(this.PERSONAS_NEXT_ID_KEY) ||
      Math.max(0, ...this.personas.map((persona) => persona.id)) + 1
    );
  }

  set nextId(value: number) {
    this.context.workspaceState.update(this.PERSONAS_NEXT_ID_KEY, value);
  }

  getDefaultPersona(): Persona {
    return this.getPersona(this.defaultPersonaId) ?? STANDARD_PERSONAS[0];
  }

  setDefaultPersona(persona: Persona): void {
    this.defaultPersonaId = persona.id;
  }

  getPersona(id: number): Persona | undefined {
    return this.personas.find((persona) => persona.id === id);
  }

  /**
   * Adds a new Persona to the workspace state and returns that Persona.
   */
  addNewPersona(name: string, instructions: string): Persona {
    const newPersona: Persona = {
      id: this.nextId,
      name,
      instructions,
    };
    this.nextId++;
    this.personas = [...this.personas, newPersona];
    return newPersona;
  }

  /**
   * Updates a Persona with the given ID in the workspace state.
   * Throws an error if the ID does not exist.
   * @param persona
   */
  updatePersona(updatedPersona: Persona): void {
    if (!this.personas.some((p) => p.id === updatedPersona.id)) {
      throw new Error("Persona ID does not exist");
    }
    this.personas = this.personas.map((p) =>
      p.id === updatedPersona.id ? updatedPersona : p,
    );
  }

  deletePersona(id: number): void {
    this.personas = this.personas.filter((persona) => persona.id !== id);
  }

  clearAllCustomPersonas(): void {
    this.personas = [];
  }
}

function hasDuplicateIds(personas: Persona[]): boolean {
  const ids = personas.map((persona) => persona.id);
  return new Set(ids).size !== ids.length;
}
