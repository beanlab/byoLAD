import { CompletionModel, CompletionModelResponse } from "../CompletionModel";

export class UnsetCompletionModel implements CompletionModel {
  private message: string;

  constructor(message: string) {
    this.message = message;
  }

  async complete(): Promise<CompletionModelResponse> {
    return { success: false, errorMessage: this.message };
  }
}
