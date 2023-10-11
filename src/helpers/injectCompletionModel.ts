import { CompletionModel } from "../CompletionModel/CompletionModel";
import { GPTCompletionModel } from "../CompletionModel/Implementations/GPTCompletionModel";
import { UnsetCompletionModel } from "../CompletionModel/Implementations/UnsetCompletionModel";
import { CompletionProviderType } from "./types";
import { PaLMCompletionModel } from "../CompletionModel/Implementations/PaLMCompletionModel";

const injectUnsetCompletionModel = (message: string): UnsetCompletionModel => {
  return new UnsetCompletionModel(message);
};

const injectGPTCompletionModel = (
  model?: string,
  apiKey?: string,
): GPTCompletionModel | UnsetCompletionModel => {
  if (!model || model === "")
    return injectUnsetCompletionModel("vscode-byolad: Model not set");
  if (!apiKey || apiKey === "")
    return injectUnsetCompletionModel("vscode-byolad: APIKey not set");

  return new GPTCompletionModel(model, apiKey);
};

const injectPaLMCompletionModel = (
  model?: string,
  apiKey?: string,
): PaLMCompletionModel | UnsetCompletionModel => {
  if (!model || model === "")
    return injectUnsetCompletionModel("vscode-byolad: Model not set");
  if (!apiKey || apiKey === "")
    return injectUnsetCompletionModel("vscode-byolad: APIKey not set");

  return new PaLMCompletionModel(model, apiKey);
};

export const injectCompletionModel = (
  provider?: CompletionProviderType,
  model?: string,
  apiKey?: string,
): CompletionModel => {
  switch (provider) {
    case CompletionProviderType.OpenAI:
      return injectGPTCompletionModel(model, apiKey);
    case CompletionProviderType.Google:
      return injectPaLMCompletionModel(model, apiKey);
    default:
      return injectUnsetCompletionModel("vscode-byolad: Provider not set");
  }
};
