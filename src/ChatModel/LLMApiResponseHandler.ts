import { ChatRole } from "../../shared/types";
import { ChatModelResponse } from "./ChatModel";
import { ChatEditor } from "../Chat/ChatEditor";
import { ExtensionToWebviewMessageSender } from "../webview/ExtensionToWebviewMessageSender";

export class LLMApiResponseHandler {
  private readonly chatEditor: ChatEditor;
  private readonly extensionToWebviewMessageSender: ExtensionToWebviewMessageSender;

  constructor(
    chatEditor: ChatEditor,
    extensionToWebviewMessageSender: ExtensionToWebviewMessageSender,
  ) {
    this.chatEditor = chatEditor;
    this.extensionToWebviewMessageSender = extensionToWebviewMessageSender;
  }

  public async handleChatResponse(response: ChatModelResponse): Promise<void> {
    if (response.success) {
      await this.handleSuccessfulResponse(response);
    } else {
      await this.handleErrorResponse(response);
    }
    await this.extensionToWebviewMessageSender.updateIsMessageLoading(false);
  }

  private async handleSuccessfulResponse(
    response: ChatModelResponse,
  ): Promise<void> {
    if (!response.markdown) {
      await this.extensionToWebviewMessageSender.updateErrorMessage(
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
    await this.extensionToWebviewMessageSender.updateErrorMessage(message);
  }
}
