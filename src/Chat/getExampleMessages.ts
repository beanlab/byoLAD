import {
  ChatMessage,
  ChatRole,
  CodeBlock,
  TextBlock,
} from "../ChatModel/ChatModel";

/**
 * Gets an array of brief introductory messages to use as an example chat.
 * Here, the user asks the assistant what it can do, and the assistant responds with a demo of its capabilities.
 * For use in the model prompt at the beginning of a chat so that the model has more to work with.
 *
 * @returns
 */
export function getExampleMessages(): ChatMessage[] {
  return [
    {
      role: ChatRole.User,
      content: [
        {
          type: "text",
          content:
            "Hello, what can you do? Can you help me with code? For example, if I ask you to fix the bug and simplify this code, how would you do that?",
        } as TextBlock,
        {
          type: "code",
          languageid: "python",
          content: "def add(a, b):\n    sum = a - b\n    return sum",
          linesInUserSourceFile: {
            start: 8,
            end: 11,
          },
        } as CodeBlock,
      ],
    },
    {
      role: ChatRole.Assistant,
      content: [
        {
          type: "text",
          content:
            "Yes, I can help you with code. I can even give you new or modified code to use in your project. For example, with the demo code you just gave, me I can correct it by giving you this:",
        } as TextBlock,
        {
          type: "code",
          languageId: "python",
          content: "def add(a,b):\n    return a + b",
          linesInUserSourceFile: {
            start: 8,
            end: 11,
          },
        } as CodeBlock,
        {
          type: "text",
          content:
            "I can even specify specifically where you went wrong. For example, the contents of that demo `add` method can be one line. (note that my 'lines' field specifies the lines in your code I'm modifying, not the line numbers of the code I'm giving you)",
        } as TextBlock,
        {
          type: "code",
          languageId: "python",
          content: "    return a + b",
          linesInUserSourceFile: {
            start: 9,
            end: 11,
          },
        } as CodeBlock,
        {
          type: "text",
          content:
            "So, now that you know what I can do, what can I help you with today?",
        } as TextBlock,
      ],
    },
  ];
}
