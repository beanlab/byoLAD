import { ChatMessage } from "../ChatModel/ChatModel";

export interface Conversation {
  id: number;
  name: string;
  messages: ChatMessage[];
  contextInstruction?: string;
}
