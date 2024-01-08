// Review command constants
export const NO_RESPONSE_ERROR_MESSAGE = "No response returned from model";
export const UNKNOWN_RESPONSE_ERROR_MESSAGE =
  "Unknown error occurred while getting the response from the model";
export const DIFF_VIEW_TITLE_SUFFIX = ": AI Suggestions ↔ Current";
export const MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE =
  "Error with byoLAD extension setting applySuggestions.diffViewPosition: Could not get merge-conflict.diffViewPosition setting or it doesn't match any of the available options (likely due to a breaking change in that extension). Using the default byoLAD setting.";
export const LLM_MESSAGE_FORMATTING_INSTRUCTION = `The user will provide you with requests/questions and optionally code samples to modify or use as reference.
  You MUST respond in valid Markdown format with any code samples using code fences and a language identifier.
  This is necessary so the user can easily see which parts of your response are code and which parts are just descriptive/explanatory Markdown text.`;

// ChatManager Keys
// Note: Changes to workspace state keys will cause compatibility issues with existing workspaces that have byoLAD data unless the data is migrated.
export const CONVERSATIONS_KEY = "conversations"; // Do not change without handling migration
export const CONVERSATION_IDS_KEY = "conversationIds"; // Do not change without handling migration
export const ACTIVE_CONVERSATION_ID_KEY = "activeConversationId"; // Do not change without handling migration
export const NEXT_ID_KEY = "nextId"; // Do not change without handling migration

// Settings/configuration error messages
export const MODEL_NOT_SET_ERROR_MESSAGE =
  "Model not set. Please set a model for the byoLAD extension.";
export const API_KEY_NOT_SET_ERROR_MESSAGE =
  "LLM API Key not set. Please set an API Key for the byoLAD extension.";
export const LLM_PROVIDER_NOT_SET_ERROR_MESSAGE =
  "Provider not set. Please choose a provider for the byoLAD extension.";
