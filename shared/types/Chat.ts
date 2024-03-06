import { ChatMessage } from ".";

/**
 * The collection of messages that make up a conversation between the user and the LLM.
 * Suitable for use in a user-facing chat interface and for conversion to the LLM's
 * expected input format.
 */
export interface Chat {
  id: number;
  messages: ChatMessage[];
  /**
   * Base contextual instruction to inform the LLM of its purpose/goal/role before the
   * rest of the conversation.
   * @example "You are a helpful coding assistant. You should help the user fix their code."
   */
  contextInstruction?: string;
  /**
   * User-facing title/name
   */
  title: string;
  tags: string[];
}
