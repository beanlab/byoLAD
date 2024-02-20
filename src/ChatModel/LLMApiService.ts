import { Chat } from "../../shared/types";
import { ChatModelResponse } from "./ChatModel";
import { LLMApiRequestSender } from "./LLMApiRequestSender";
import { LLMApiResponseHandler } from "./LLMApiResponseHandler";

/**
 * Handles sending chat requests to the LLM APIs and processing the responses.
 */
export class LLMApiService {
  private requestSender: LLMApiRequestSender;
  private responseHandler: LLMApiResponseHandler;

  constructor(
    messageSender: LLMApiRequestSender,
    responseHandler: LLMApiResponseHandler,
  ) {
    this.requestSender = messageSender;
    this.responseHandler = responseHandler;
  }

  /**
   * Requests a message response from the LLM API based on the given chat.
   * @param chat Chat to have the LLM respond to.
   */
  public async requestLlmApiChatResponse(chat: Chat): Promise<void> {
    const response: ChatModelResponse =
      await this.requestSender.sendChatRequest(chat);
    await this.responseHandler.handleChatResponse(chat, response);
  }
}
