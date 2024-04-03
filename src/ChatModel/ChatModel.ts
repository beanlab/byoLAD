import { Chat, ChatMessageFinishReason, Persona } from "../../shared/types";

export interface ChatModel {
  chat: (request: ChatModelRequest) => Promise<ChatModelResponse>;
}

/**
 * Everything needed to request a chat response from the LLM API.
 */
export interface ChatModelRequest {
  chat: Chat;
  persona: Persona;
  responseFormattingInstruction: string;
}

/**
 * Everything needed to handle a chat response from the LLM API.
 */
export interface ChatModelResponse {
  /**
   * Whether the chat request was successful. False if there was an error.
   */
  success: boolean;
  /**
   * Content of the message, interpreted as markdown. Only may be present if
   * `success` is true.
   */
  content?: string;
  /**
   * Reason the message finished, if any. Only may be present if `success` is
   * true.
   */
  finishReason?: ChatMessageFinishReason;
  /**
   * Description of the error that occurred, if any. Only may be present if
   * `success` is false.
   */
  errorMessage?: string;
}
