import {
  CompletionModel,
  CompletionModelRequest,
  CompletionModelResponse,
} from "../CompletionModel";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

export class PaLMCompletionModel implements CompletionModel {
  private client: TextServiceClient;

  constructor(apiKey: string) {
    console.log(apiKey);
    this.client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(apiKey),
    });
  }

  private formatPrompt(request: CompletionModelRequest): string {
    return `This is your system instruction: ${request.instruction}\n\nThis is the given code: ${request.code}\n\nThis is your completion:\n\n`;
  }

  async complete(
    request: CompletionModelRequest,
  ): Promise<CompletionModelResponse> {
    const completion = await this.client.generateText({
      model: "models/text-bison-001", // This is hardcoded for now, but should be made configurable in the future.
      prompt: {
        text: this.formatPrompt(request),
      },
    });
    console.log(completion);

    if (
      completion[0] &&
      completion[0]?.candidates &&
      completion[0].candidates.length > 0
    ) {
      return {
        success: true,
        completion: completion[0].candidates[0].output as string,
      };
    }

    return {
      success: false,
      errorMessage: "An error occurred while completing the code.",
    };
  }
}
