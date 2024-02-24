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
   * Reference to the Persona of the LLM in this chat. This is used to determine the LLM's
   * behavior and responses in the chat.
   */
  personaId: number;
  /**
   * User-facing title/name
   */
  title: string;
}
