import { CompletionModel } from "../CompletionModel/CompletionModel";
import { GPTCompletionModel } from "../CompletionModel/Implementations/GPTCompletionModel";
import { UnsetCompletionModel } from "../CompletionModel/Implementations/UnsetCompletionModel";
import { CompletionModelType } from "./types";
import { PaLMCompletionModel } from "../CompletionModel/Implementations/PaLMCompletionModel";

const injectUnsetCompletionModel = (message: string): UnsetCompletionModel => {
  return new UnsetCompletionModel(message);
};

const injectGPTCompletionModel = (
  apiKey?: string,
): GPTCompletionModel | UnsetCompletionModel => {
  if (apiKey) return new GPTCompletionModel(apiKey);

  return injectUnsetCompletionModel("vs-code-ai-extension: APIKey not set");
};

const injectPaLMCompletionModel = (
  apiKey?: string,
): PaLMCompletionModel | UnsetCompletionModel => {
  if (apiKey) return new PaLMCompletionModel(apiKey);

  return injectUnsetCompletionModel("vs-code-ai-extension: APIKey not set");
};

export const injectCompletionModel = (
  model?: CompletionModelType,
  apiKey?: string,
): CompletionModel => {
  switch (model) {
    case CompletionModelType.GPT3:
      return injectGPTCompletionModel(apiKey);
    case CompletionModelType.PaLM:
      return injectPaLMCompletionModel(apiKey);
    default:
      return injectUnsetCompletionModel("vs-code-ai-extension: Model not set");
  }
};
