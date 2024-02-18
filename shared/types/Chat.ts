import { ChatMessage } from ".";

export interface Chat {
  id: number;
  messages: ChatMessage[];
  /**
   * Base contextual instruction to inform the LLM of its purpose/goal/role
   */
  contextInstruction?: string;
  title: string;
}
