import { Chat } from "../../shared/types";
import { ChatModelRequest, ChatModelResponse } from "./ChatModel";
import { SettingsProvider } from "../helpers/SettingsProvider";

export class LLMApiRequestSender {
  private readonly settingsProvider: SettingsProvider;

  constructor(settingsProvider: SettingsProvider) {
    this.settingsProvider = settingsProvider;
  }

  public async sendChatRequest(chat: Chat): Promise<ChatModelResponse> {
    return await this.settingsProvider.getChatModel().chat({
      chat,
    } as ChatModelRequest);
  }
}
