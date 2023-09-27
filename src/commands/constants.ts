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
export const EMPTY_COMPLETION_ERROR_MESSAGE =
  "Empty completion returned from model";
export const NO_COMPLETION_ERROR_MESSAGE = "No completion returned from model";
export const UNKNOWN_COMPLETION_ERROR_MESSAGE =
  "Unknown error occurred while getting the completion from the model";
export const DIFF_VIEW_TITLE_SUFFIX_MANUAL_MODE = ": AI Suggestions ↔ Current";
export const NOT_IMPLEMENTED_ERROR_MESSAGE = "Not implemented";
