import { Chat, ChatMessageFinishReason } from "../../shared/types";

export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

export interface ChatModelRequest {
  chat: Chat;
}

export interface ChatModelResponse {
  success: boolean;
  markdown?: string;
  finishReason?: ChatMessageFinishReason;
  errorMessage?: string;
  chat: Chat;
}
