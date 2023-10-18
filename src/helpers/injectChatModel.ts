import { UnsetChatModel } from "../ChatModel/Implementations/UnsetChatModel";
import { LLMProvider } from "./types";
import { PaLMChatModel } from "../ChatModel/Implementations/PaLMChatModel";
import {
  API_KEY_NOT_SET_ERROR_MESSAGE,
  LLM_PROVIDER_NOT_SET_ERROR_MESSAGE,
  MODEL_NOT_SET_ERROR_MESSAGE,
} from "../commands/constants";
import { GPTChatModel } from "../ChatModel/Implementations/GPTChatModel";
import { ChatModel } from "../ChatModel/ChatModel";

/**
 * Creates a ChatModel based on the provider, model, and apiKey.
 * Displays an error message if any of the required settings are not set.
 *
 * @param provider The provider to use for the ChatModel
 * @param model The model to use for the ChatModel
 * @param apiKey The API Key to use for the ChatModel
 * @returns A ChatModel based on the provider, model, and apiKey (or UnsetChatModel if any of the required settings are not set)
 */
export const injectChatModel = (
  provider?: LLMProvider,
  model?: string,
  apiKey?: string
): ChatModel => {
  switch (provider) {
    case LLMProvider.OpenAI:
      return injectGPTChatModel(model, apiKey);
    case LLMProvider.Google:
      return injectPaLMChatModel(model, apiKey);
    default:
      return injectUnsetChatModel(LLM_PROVIDER_NOT_SET_ERROR_MESSAGE);
  }
};

const injectUnsetChatModel = (message: string): UnsetChatModel => {
  return new UnsetChatModel(message);
};

const injectGPTChatModel = (
  model?: string,
  apiKey?: string
): GPTChatModel | UnsetChatModel => {
  if (!model || model === "")
    return injectUnsetChatModel(MODEL_NOT_SET_ERROR_MESSAGE);
  if (!apiKey || apiKey === "")
    return injectUnsetChatModel(API_KEY_NOT_SET_ERROR_MESSAGE);

  return new GPTChatModel(model, apiKey);
};

const injectPaLMChatModel = (
  model?: string,
  apiKey?: string
): PaLMChatModel | UnsetChatModel => {
  if (!model || model === "")
    return injectUnsetChatModel(MODEL_NOT_SET_ERROR_MESSAGE);
  if (!apiKey || apiKey === "")
    return injectUnsetChatModel(API_KEY_NOT_SET_ERROR_MESSAGE);

  return new PaLMChatModel(model, apiKey);
};
