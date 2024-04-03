/**
 * The role/author associated with a given ChatMessage.
 * When sent to the LLM, the role may have to be converted to match the LLM's
 * expected input format.
 */
export enum ChatRole {
  User = "user",
  System = "system",
  Assistant = "assistant",
}
