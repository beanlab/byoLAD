import { ChatRole } from "../../shared/types";
import { ChatModelResponse } from "./ChatModel";
import { ChatEditor } from "../Chat/ChatEditor";
import { ChatWebviewMessageSender } from "../providers/ChatWebviewMessageSender";

export class LLMApiResponseHandler {
  private readonly chatEditor: ChatEditor;
  private readonly chatWebviewMessageSender: ChatWebviewMessageSender;

  constructor(
    chatEditor: ChatEditor,
    chatWebviewMessageSender: ChatWebviewMessageSender,
  ) {
    this.chatEditor = chatEditor;
    this.chatWebviewMessageSender = chatWebviewMessageSender;
  }

  public async handleChatResponse(response: ChatModelResponse): Promise<void> {
    if (response.success) {
      await this.handleSuccessfulResponse(response);
    } else {
      await this.handleErrorResponse(response);
    }
    await this.chatWebviewMessageSender.updateIsMessageLoading(false);
  }

  private async handleSuccessfulResponse(
    response: ChatModelResponse,
  ): Promise<void> {
    if (!response.markdown) {
      await this.chatWebviewMessageSender.updateErrorMessage(
        "AI successfully replied, but its message was inexplicably empty.",
      );
      return;
    }
    await this.chatEditor.appendMarkdown(
      response.chat,
      ChatRole.Assistant,
      response.markdown,
    );
  }

  private async handleErrorResponse(
    response: ChatModelResponse,
  ): Promise<void> {
    let message = "Unknown error";
    if (response.errorMessage) {
      message = `Error: ${response.errorMessage}`;
    }
    await this.chatWebviewMessageSender.updateErrorMessage(message);
  }
}
