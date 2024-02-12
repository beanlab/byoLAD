/**
 * A section of a message. A complete message in a Chat is made up of one or more blocks.
 */
export interface MessageBlock {
  type: "text" | "code";
  /**
   * The content of the block.
   * For a TextBlock: markdown text.
   * For a CodeBlock: the code itself without the code fences or language identifier.
   */
  content: string;
}

/**
 * A text block in a message. The content is markdown text.
 */
export interface TextBlock extends MessageBlock {
  type: "text";
}

/**
 * A code block in a message. The content is the code itself without the code fences or language identifier.
 */
export interface CodeBlock extends MessageBlock {
  type: "code";
  /**
   * The language identifier of the code block as used in markdown code fences.
   */
  languageId?: string;
}
