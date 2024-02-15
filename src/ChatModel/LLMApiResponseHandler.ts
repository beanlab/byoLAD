import { ChatRole } from "../../shared/types";
import { ChatModelResponse } from "./ChatModel";
import { ChatWebviewProvider } from "../providers/ChatViewProvider";
import { ChatEditor } from "../Chat/ChatEditor";

export class LLMApiResponseHandler {
  private readonly chatEditor: ChatEditor;
  private readonly chatWebviewProvider: ChatWebviewProvider;

  constructor(
    chatEditor: ChatEditor,
    chatWebviewProvider: ChatWebviewProvider,
  ) {
    this.chatEditor = chatEditor;
    this.chatWebviewProvider = chatWebviewProvider;
  }

  public handleChatResponse(response: ChatModelResponse): void {
    if (response.success) {
      this.handleSuccessfulResponse(response);
    } else {
      this.handleErrorResponse(response);
    }
    this.chatWebviewProvider.updateIsMessageLoading(false);
  }

  private handleSuccessfulResponse(response: ChatModelResponse): void {
    if (!response.markdown) {
      this.chatWebviewProvider.updateErrorMessage(
        "AI successfully replied, but its message was inexplicably empty.",
      );
      return;
    }
    this.chatEditor.appendMarkdown(
      response.chat,
      ChatRole.Assistant,
      response.markdown,
    );
  }

  private handleErrorResponse(response: ChatModelResponse): void {
    let message = "Unknown error";
    if (response.errorMessage) {
      message = `Error: ${response.errorMessage}`;
    }
    this.chatWebviewProvider.updateErrorMessage(message);
  }
}
