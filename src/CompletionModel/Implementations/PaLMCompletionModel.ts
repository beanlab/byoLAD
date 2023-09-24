import {
  CompletionModel,
  CompletionModelRequest,
  CompletionModelResponse,
} from "../CompletionModel";
import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

export class PaLMCompletionModel implements CompletionModel {
  private client: TextServiceClient;
  private model: string;

  constructor(model: string, apiKey: string) {
    this.client = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey(apiKey),
    });
    this.model = model;
  }

  private formatPrompt(request: CompletionModelRequest): string {
    return `This is your system instruction: ${request.instruction}\n\nThis is the given code: ${request.code}\n\nThis is your completion:\n\n`;
  }

  async complete(
    request: CompletionModelRequest,
  ): Promise<CompletionModelResponse> {
    return await this.client
      .generateText({
        model: `models/${this.model}`,
        prompt: {
          text: this.formatPrompt(request),
        },
      })
      .then((completion) => {
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
