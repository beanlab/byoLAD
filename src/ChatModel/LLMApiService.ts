import { Chat } from "../../shared/types";
import { LLMApiRequestSender } from "./LLMApiRequestSender";
import { LLMApiResponseHandler } from "./LLMApiResponseHandler";

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

  public async requestLlmApiChatResponse(chat: Chat): Promise<void> {
    const response = await this.requestSender.sendChatRequest(chat);
    await this.responseHandler.handleChatResponse(response);
  }
}
