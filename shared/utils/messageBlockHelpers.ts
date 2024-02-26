import { CodeBlock, MessageBlock, TextBlock } from "../types";

/**
 * Converts a string input into an array of message blocks. Input is assumed to be Markdown.
 * A message block can be either a text block or a code block.
 * A text block is a block of text that does not contain any code fences.
 * A code block is a block of code that is enclosed by a pair of code fences.
 * @param markdown The Markdown string to convert into message blocks.
 * @returns An array of message blocks.
 * @throws An error if the number of code fences is odd.
 */
export function stringToMessageBlocks(markdown: string): MessageBlock[] {
  const sections = markdown.split("```");

  if (sections.length % 2 === 0) {
    throw new Error("Odd number of code fences");
  }

  const blocks: MessageBlock[] = [];
  for (let i = 0; i < sections.length; i++) {
    let content = sections[i];
    if (content) {
      if (i % 2 === 0) {
        // text block
        content = content.trim();
        blocks.push({ type: "text", content: content } as TextBlock);
      } else {
        // code block
        const lines = content.split("\n");
        let languageId = lines.shift();
        if (languageId === "") {
          languageId = undefined;
        }
        let codeContent = lines.join("\n");
        if (codeContent.endsWith("\n")) {
          // don't want to trim() completely because we want to preserve indentation
          codeContent = codeContent.slice(0, -1);
        }
        blocks.push({
          type: "code",
          content: codeContent,
          languageId: languageId,
        } as CodeBlock);
      }
    }
  }

  return blocks;
}

/**
 * Converts a list of message blocks to a Markdown string.
 * Code blocks will be converted to Markdown code fences with language identifiers if available.
 *
 * @param messageBlocks The list of message blocks to convert to a Markdown string.
 */
export function messageBlocksToString(messageBlocks: MessageBlock[]): string {
  let markdown = "";
  for (const block of messageBlocks) {
    if (block.type === "text") {
      markdown += `${block.content}\n`;
    } else if (block.type === "code") {
      markdown += `\`\`\`${(block as CodeBlock).languageId}\n${
        block.content
      }\n\`\`\`\n`;
    }
  }
  markdown = markdown.slice(0, -1); // remove last newline
  return markdown;
}
