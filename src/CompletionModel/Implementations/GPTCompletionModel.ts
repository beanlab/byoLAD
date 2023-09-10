import {
  CompletionModel,
  CompletionModelRequest,
  CompletionModelResponse,
} from "../CompletionModel";
import OpenAI from "openai";

export class GPTCompletionModel implements CompletionModel {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async complete(
    request: CompletionModelRequest,
  ): Promise<CompletionModelResponse> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: request.instruction,
        },
        { role: "user", content: request.code },
      ],
      model: "gpt-3.5-turbo", // This is hardcoded for now, but should be made configurable in the future.
    });

    if (completion.choices.length > 0) {
      return {
        success: true,
        completion: completion.choices[0].message.content as string,
      };
    }

    return {
      success: false,
      errorMessage: "An error occurred while completing the code.",
    };
  }
}
