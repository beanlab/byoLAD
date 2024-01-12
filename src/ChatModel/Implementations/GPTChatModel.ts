import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";
import {
  ChatModel,
  ChatModelRequest,
  ChatModelResponse,
  ChatRole,
  ChatMessageFinishReason,
  ChatMessage,
} from "../ChatModel";
import OpenAI from "openai";
import {
  messageBlocksToString,
  stringToMessageBlocks,
} from "../../Chat/messageBlockHelpers";
import { Chat } from "../ChatModel";
import { getExampleMessages } from "../../Chat/getExampleMessages";

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
        messages: this.convertToGPTMessages(request.chat),
        model: this.model,
      })
      .then((completion) => {
        if (completion.choices.length > 0) {
          return {
            success: true,
            message: {
              role: completion.choices[0].message.role as ChatRole,
              content: stringToMessageBlocks(
                completion.choices[0].message.content as string,
              ),
              finish_reason: completion.choices[0]
                .finish_reason as ChatMessageFinishReason,
            },
          };
        } else {
          return {
            success: false,
            errorMessage: NO_RESPONSE_ERROR_MESSAGE,
          };
        }
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: error.message,
        };
      });
  }

  private convertToGPTMessages(chat: Chat): GPTMessage[] {
    const gptMessages: GPTMessage[] = [];

    // The first message should provide contextual information
    // and generally applicable instructions for the model to use
    if (chat.contextInstruction) {
      gptMessages.push({
        role: ChatRole.System,
        content: chat.contextInstruction,
      });
    }

    // Add messages to the beginning of the chat history to provide examples/set the stage
    const exampleMessages: ChatMessage[] = getExampleMessages();
    for (const message of exampleMessages) {
      gptMessages.push({
        role: message.role,
        content: messageBlocksToString(message.content),
      });
    }

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
