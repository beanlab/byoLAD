import { ChatRole, MessageBlock } from ".";

export interface ChatMessage {
  role: ChatRole;
  content: MessageBlock[];
  finishReason?: ChatMessageFinishReason;
}

export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}
