import { ChatModel, ChatModelResponse } from "../ChatModel";

export class UnsetChatModel implements ChatModel {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }
  // TODO: Reconsider this UnsetChatModel strategy (especially if not handled through Settings)
  async chat(): Promise<ChatModelResponse> {
    return {
      success: false,
      errorMessage: this.message,
      chat: {},
    } as ChatModelResponse;
  }
}
