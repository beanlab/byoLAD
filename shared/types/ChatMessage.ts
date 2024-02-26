import { ChatRole, MessageBlock } from ".";

/**
 * Individual message in a Chat.
 */
export interface ChatMessage {
  role: ChatRole;
  content: MessageBlock[];
  /**
   * Optional field to indicate the reason the chat message was finished.
   * This is useful for determining why a chat ended, and can be used to
   * provide feedback to the user.
   */
  finishReason?: ChatMessageFinishReason;
}

/**
 * The reason a chat message was termianted. May not be supported by all LLMs.
 */
export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}
