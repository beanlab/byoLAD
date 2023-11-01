export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

export interface ChatModelRequest {
  conversation: Conversation;
}

export interface ChatModelResponse {
  success: boolean;
  errorMessage?: string;
  message?: ChatMessage;
}

export interface ChatMessage {
  role: ChatRole;
  content: MessageBlock[];
  finishReason?: ChatMessageFinishReason;
}

export interface MessageBlock {
  type: "text" | "code";
  /**
   * The content of the block.
   * For a TextBlock: markdown text.
   * For a CodeBlock: the code itself without the code fences or language identifier.
   */
  content: string;
}

export interface TextBlock extends MessageBlock {
  type: "text";
}

export interface CodeBlock extends MessageBlock {
  type: "code";
  /**
   * The language identifier of the code block as used in markdown code fences.
   */
  languageId?: string;
}

export enum ChatRole {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}

export interface Conversation {
  id: number;
  name: string;
  messages: ChatMessage[];
  contextInstruction?: string;
}
