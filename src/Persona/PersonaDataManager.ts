import { ExtensionContext } from "vscode";
import { ModelProvider, Persona } from "../../shared/types";
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

  get customPersonas(): Persona[] {
    return (
      this.context.workspaceState.get<Persona[]>(this.PERSONAS_CUSTOM_KEY) || []
    );
  }

  /**
   * All Personas, including standard and custom Personas saved in the workspace state.
   * Checks for and purges any duplicate IDs, persisting the changes to the workspace state as well.
   */
  get personas(): Persona[] {
    return [...STANDARD_PERSONAS, ...this.customPersonas];
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

  /** Default ModelProvider (enum) */
  get defaultModelProvider(): string {
    return this.getDefaultPersona().modelProvider;
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
    return this.getPersonaById(this.defaultPersonaId) ?? STANDARD_PERSONAS[0];
  }

  setDefaultPersona(persona: Persona): void {
    this.defaultPersonaId = persona.id;
  }

  getPersonaById(id: number): Persona | undefined {
    return this.personas.find((persona) => persona.id === id);
  }

  getPersonaByName(name: string): Persona | null {
    return this.personas.find((persona) => persona.name === name) || null;
  }

  /**
   * Adds a new Persona to the workspace state and returns that Persona.
   */
  addNewPersona(
    name: string,
    description: string,
    instructions: string,
    modelProvider: ModelProvider,
    modelId: string,
  ): Persona {
    this.vaidateNameProperties(name);
    const newPersona: Persona = {
      id: this.nextId,
      name,
      description,
      instructions,
      modelProvider,
      modelId,
    };
    this.nextId++;
    this.personas = [...this.personas, newPersona];
    return newPersona;
  }

  /**
   * Updates a Persona with the given ID in the workspace state.
   * Throws an error if the ID does not exist.
   * @param id The ID of the Persona to update.
   * @param instructions The new instructions for the Persona.
   */
  updatePersonaInstructions(personaId: number, instructions: string): void {
    const persona = this.getPersonaById(personaId);
    if (!persona) {
      throw new Error(`Persona with ID ${personaId} does not exist`);
    }
    persona.instructions = instructions;
    this.personas = this.personas.map((p) =>
      p.id === personaId ? persona : p,
    );
  }

  deletePersona(id: number): void {
    this.personas = this.personas.filter((persona) => persona.id !== id);
  }

  clearAllCustomPersonas(): void {
    this.personas = [];
  }

  validateNewPersonaName(name: string): void {
    this.vaidateNameProperties(name);
    this.validateNameUniqueness(name);
  }

  validateNameUniqueness(name: string): void {
    if (this.personas.some((persona) => persona.name === name)) {
      throw new Error(`Persona with name "${name}" already exists`);
    }
  }

  vaidateNameProperties(name: string) {
    if (!name.trim()) {
      throw new Error("Persona name cannot be empty or whitespace");
    }
    if (name.length > 25) {
      throw new Error("Persona name cannot be more than 25 characters");
    }
  }
}

function hasDuplicateIds(personas: Persona[]): boolean {
  const ids = personas.map((persona) => persona.id);
  return new Set(ids).size !== ids.length;
}
