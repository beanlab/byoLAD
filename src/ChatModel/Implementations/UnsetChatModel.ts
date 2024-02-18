import { ChatModel, ChatModelResponse } from "../ChatModel";

export class UnsetChatModel implements ChatModel {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  async chat(): Promise<ChatModelResponse> {
    return {
      success: false,
      errorMessage: this.message,
      chat: {},
    } as ChatModelResponse;
  }
}
