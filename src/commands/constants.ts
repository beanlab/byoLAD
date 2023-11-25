// Review command constants
export const NO_RESPONSE_ERROR_MESSAGE = "No response returned from model";
export const UNKNOWN_RESPONSE_ERROR_MESSAGE =
  "Unknown error occurred while getting the response from the model";
export const DIFF_VIEW_TITLE_SUFFIX = ": AI Suggestions ↔ Current";
export const MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE =
  "Error with byoLAD extension setting applySuggestions.diffViewPosition: Could not get merge-conflict.diffViewPosition setting or it doesn't match any of the available options (likely due to a breaking change in that extension). Using the default byoLAD setting.";

// ConversationManager Keys
export const CONVERSATIONS_KEY = "conversations";
export const CONVERSATION_IDS_KEY = "conversationIds";
export const ACTIVE_CONVERSATION_ID_KEY = "activeConversationId";
export const NEXT_ID_KEY = "nextId";

// Settings/configuration error messages
export const MODEL_NOT_SET_ERROR_MESSAGE =
  "Model not set. Please set a model for the byoLAD extension.";
export const API_KEY_NOT_SET_ERROR_MESSAGE =
  "LLM API Key not set. Please set an API Key for the byoLAD extension.";
export const LLM_PROVIDER_NOT_SET_ERROR_MESSAGE =
  "Provider not set. Please choose a provider for the byoLAD extension.";
