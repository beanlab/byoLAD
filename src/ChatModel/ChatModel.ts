export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

export interface ChatModelRequest {
  messages: ChatMessage[];
}

export interface ChatModelResponse {
  success: boolean;
  errorMessage?: string;
  message?: ChatMessage;
}

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
  finish_reason?: ChatMessageFinishReason;
}

export enum ChatMessageRole {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}
