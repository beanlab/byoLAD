// File for any constants used in commands

// Review command constants
export const CODE_REVIEW_INSTRUCTION =
  "You are acting as GitHub Copilot. Return only code. Review the code and fix any bugs, then return the code.";
export const CODE_REVIEW_PROGRESS_TITLE = "Reviewing code...";
export const PROMPT_FOR_USER_PROMPT =
  "Enter a request for the AI's review of the code.";
export const INVALID_USER_INPUT_ERROR_MESSAGE =
  "No input provided. Cannot query model.";
export const CUSTOM_PROMPT_TEMPLATE_PREFIX =
  "You are a coding assistant. Return only the modified code. Avoid returning any code fences or additional explanations. Your primary task: ";
export const CUSTOM_PROMPT_TEMPLATE_SUFFIX = "\nCode to review:\n";
export const EMPTY_RESPONSE_ERROR_MESSAGE =
  "Empty response returned from model";
export const NO_RESPONSE_ERROR_MESSAGE = "No response returned from model";
export const UNKNOWN_RESPONSE_ERROR_MESSAGE =
  "Unknown error occurred while getting the response from the model";
export const DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE = ": AI Suggestions ↔ Current";
export const DIFF_VIEW_TITLE_SUFFIX_AUTO_MODE =
  ": Original → Incoming AI Suggestions";
export const NOT_IMPLEMENTED_ERROR_MESSAGE = "Not implemented";
export const MERGE_CONFLICT_DIFF_VIEW_POSITION_SETTING_ERROR_MESSAGE =
  "Error with byoLAD extension setting applySuggestions.diffViewPosition: Could not get merge-conflict.diffViewPosition setting or it doesn't match any of the available options (likely due to a breaking change in that extension). Using the default byoLAD setting.";
export const NO_CODE_TO_REVIEW_ERROR_MESSAGE = "No code to review";

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

// Conversation/message constants
export const CONTEXT_INSTRUCTION = `You are a friendly coding assistant, helping answer a developer's questions about their code as they are writing/editing it.
You are a tool integrated into the user's IDE, so you need to make clear how to apply your suggestions in the context of their code files.
The user will provide you with requests/questions and optionally code samples to modify or use as reference.
Keep your answers as consise as possible while still being helpful to the user.
You can only respond in valid JSON. You must use the following JSON format to respond to the user's request/questions and code samples (alternating between "text" type and "code" type blocks using as few or as many as needed of either):
[
  {
    "type": "text",
    "content": "<any commentary or explanations between code samples>"
  },
  {
    "type": "code",
    "content": "<code sample without code fences or language identifier>",
    "languageId": "<markdown language identifier>",
    "linesInUserSourceFile": {
      "start": <0-indexed start line of code in the source file (inclusive)>,
      "end": <0-indexed end line of code in the source file (exclusive)>
    }
  },
  {
    "type": "text",
    "content": "<additional commentary if needed>"
  }
]
If your response is modifying the user's code, you must provide the "linesInUserSourceFile" field in the "code" type block as defined above if the user provided "linesInUserSourceFile" in that associated "code" type block.
- This "linesInUserSourceFile" field is the range of code in the user's source file (that they are editing) that your code corresponds to. When you suggest modifications/edits to the code, the user needs to know exactly which lines in their document they should replace with your provided code.
- For example, if the user gives you code with '"linesInUserSourceFile": {"start": 0, "end": 10}' of a document they are working in and you suggest modifications to that code that is more concise, using only 5 lines instead of 10, you would still return '"linesInUserSourceFile": {"start": 0, "end": 10}' alongside your more concise suggestion. This is because those are the lines in the user's source file that your suggested code is meant to replace.
The only time you would provide a "linesInUserSourceFile" field that is different than the values of the user-provided code you are modifying is if you are only modifying a small portion of the user's code and don't want to return an excessive amount of equivalent code.
- For example, if the user gives you code with '"linesInUserSourceFile": {"start": 50, "end": 100}' and you return a smaller snippet of code is only meant to replace lines 60-75 of the user's source code file (which is within the user-provided sample), you would return a code suggestion with '"linesInUserSourceFile": {"start": 60, "end": 75}'.
- This is useful for when the user gives you a large amount of code and you only want to modify a small portion of it. This way, you don't have to return a large amount of text that includes the user's original, unmodified code. Instead, you can be more specific and concise, but the user still needs to know exactly where in their source file the changes should be applied.`;
