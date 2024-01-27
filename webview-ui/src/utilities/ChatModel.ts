// TODO: There's a better way to share these types between the main extension and the webview
// We don't even have to use the same types necessarily, but there should be a way to convert
// between them easily and safely

export interface ChatMessage {
  role: ChatRole;
  content: MessageBlock[];
  finishReason?: ChatMessageFinishReason;
}

export interface MessageBlock {
  type: "text" | "code";
  /**
   * The content of the block.
   * For a TextBlock: markdown text.
   * For a CodeBlock: the code itself without the code fences or language identifier.
   */
  content: string;
}

export interface TextBlock extends MessageBlock {
  type: "text";
}

export interface CodeBlock extends MessageBlock {
  type: "code";
  /**
   * The language identifier of the code block as used in markdown code fences.
   */
  languageId?: string;
}

export enum ChatRole {
  User = "user",
  System = "system",
  Assistant = "assistant",
}

export enum ChatMessageFinishReason {
  Stop = "stop",
  Length = "length",
  ContentFilter = "content_filter",
}

export interface Conversation {
  id: number;
  name: string;
  messages: ChatMessage[];
  contextInstruction?: string;
  title: string;
}
