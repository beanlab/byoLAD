import { Chat, ChatMessage } from "../../shared/types";

export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

export interface ChatModelRequest {
  chat: Chat;
}

export interface ChatModelResponse {
  success: boolean;
  errorMessage?: string;
  message?: ChatMessage;
}
