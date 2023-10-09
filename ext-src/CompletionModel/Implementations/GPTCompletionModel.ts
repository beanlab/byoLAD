import {
  CompletionModel,
  CompletionModelRequest,
  CompletionModelResponse,
} from "../CompletionModel";
import OpenAI from "openai";

export class GPTCompletionModel implements CompletionModel {
  private openai: OpenAI;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
    this.model = model;
  }

  async complete(
    request: CompletionModelRequest,
  ): Promise<CompletionModelResponse> {
    return await this.openai.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: request.instruction,
          },
          { role: "user", content: request.code },
        ],
        model: this.model,
      })
      .then((completion) => {
        if (completion.choices.length > 0) {
          return {
            success: true,
            completion: completion.choices[0].message.content as string,
          };
        }
        return {
          success: false,
          errorMessage:
            "vscode-byolad: There was no completion provided by the model.",
        };
      })
      .catch((error) => {
        return {
          success: false,
          errorMessage: `vscode-byolad: ${error.message}`,
        };
      });
  }
}
