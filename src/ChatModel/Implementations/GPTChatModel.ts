import { NO_RESPONSE_ERROR_MESSAGE } from "../../commands/constants";
import {
  ChatModel,
  ChatModelRequest,
  ChatModelResponse,
  ChatMessageRole,
  ChatMessageFinishReason,
} from "../ChatModel";
import OpenAI from "openai";

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
        messages: request.messages,
        model: this.model,
      })
      .then((completion) => {
        if (completion.choices.length > 0) {
          return {
            success: true,
            message: {
              role: completion.choices[0].message.role as ChatMessageRole,
              content: completion.choices[0].message.content as string,
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
          errorMessage: `Unknown Error: ${error.message}`,
        };
      });
  }
}
