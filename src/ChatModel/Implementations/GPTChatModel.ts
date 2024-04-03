import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";
import { Chat, ChatRole, ChatMessageFinishReason } from "../../../shared/types";
import { ChatModel, ChatModelRequest, ChatModelResponse } from "../ChatModel";
import OpenAI from "openai";
import { messageBlocksToString } from "../../../shared/utils/messageBlockHelpers";

export class GPTChatModel implements ChatModel {
  private openai: OpenAI;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    this.model = model;
  }

  async chat(request: ChatModelRequest): Promise<ChatModelResponse> {
    return await this.openai.chat.completions
      .create({
        messages: this.convertToGPTMessages(
          request.chat,
          request.persona.instructions +
            "\n" +
            request.responseFormattingInstruction,
        ),
        model: this.model,
      })
      .then((completion) => {
        if (completion.choices.length > 0) {
          return {
            success: true,
            content: completion.choices[0].message.content as string,
            finishReason: completion.choices[0]
              .finish_reason as ChatMessageFinishReason,
            chat: request.chat,
          } as ChatModelResponse;
        } else {
          return {
            success: false,
            errorMessage: NO_RESPONSE_ERROR_MESSAGE,
            chat: request.chat,
          } as ChatModelResponse;
        }
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error.message,
          chat: request.chat,
        } as ChatModelResponse;
      });
  }

  private convertToGPTMessages(
    chat: Chat,
    baseInstructions: string,
  ): GPTMessage[] {
    const gptMessages: GPTMessage[] = [];

    // The first message should provide contextual information
    // and generally applicable instructions for the model to use
    gptMessages.push({
      role: ChatRole.System,
      content: baseInstructions,
    });

    // Every other message in the chat history should be sent to the model after that
    for (const message of chat.messages) {
      gptMessages.push({
        role: message.role,
        content: messageBlocksToString(message.content),
      });
    }

    return gptMessages;
  }
}

interface GPTMessage {
  role: ChatRole;
  content: string;
}
