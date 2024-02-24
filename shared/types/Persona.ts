/**
 * The character/purpose/identity of the LLM in a conversation.
 */
export interface Persona {
  id: number;
  name: string;
  /**
   * Base contextual instructions to inform the LLM of its purpose/goal/role.
   * @example "You are a helpful coding assistant. Your purpose is to help the user fix their code."
   */
  instructions: string;
}
