import { ExtensionContext } from "vscode"
import * as constants from '../commands/constants'
import { DefaultPersonas } from '../helpers/defaultPersonas'

export class PersonaManager {
    private readonly context: ExtensionContext
  
    constructor(context: ExtensionContext) {
      this.context = context;
    }

    get personas(): Persona[] {
        return this.context.workspaceState.get<Persona[]>(constants.PERSONAS_KEY) || []
    }

    set personas(value: Persona[]) {
        const personas = value.map((persona) => persona.name)
        if (new Set(personas).size !== personas.length) {
          throw new Error("Duplicate personas")
        }
        this.context.workspaceState.update(constants.PERSONAS_KEY, value)
    }

    get activePersona(): Persona {
        const activePersona = this.context.workspaceState.get<Persona>(constants.ACTIVE_PERSONA_KEY)
        if (activePersona == null) return DefaultPersonas.FRIENDLY_CODING_ASSISTANT_PERSONA
        return activePersona
    }

    set activePersona(value: Persona) {
        this.context.workspaceState.update(constants.ACTIVE_PERSONA_KEY, value);
    }    

    createPersona(name: string, instructions: string): Persona {
        const persona = {
            name,
            instructions
        }
        this.personas = [...this.personas, persona];
        return persona;
    }

}


// Interfaces
export interface Persona {
    name: string
    instructions: string
}

