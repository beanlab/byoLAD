import { ChatMessage } from "./ChatMessage";

export interface Chat {
  id: number;
  name: string;
  messages: ChatMessage[];
  /**
   * Base contextual instruction to inform the LLM of its purpose/goal/role
   */
  contextInstruction?: string;
  title: string;
}
