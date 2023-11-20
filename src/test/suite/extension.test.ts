import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { CodeBlock, MessageBlock, TextBlock } from "../../ChatModel/ChatModel";
import { stringToMessageBlocks } from "../../Conversation/messageBlockHelpers";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("stringToMessageBlocks should return an array of message blocks", () => {
    const input = "Hello, world!";
    const expectedOutput: MessageBlock[] = [
      { type: "text", content: "Hello, world!" } as TextBlock,
    ];
    const actualOutput = stringToMessageBlocks(input);
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });

  test("stringToMessageBlocks should handle empty input", () => {
    const input = "";
    const expectedOutput: MessageBlock[] = [];
    const actualOutput = stringToMessageBlocks(input);
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });

  test("stringToMesaageBlocks should handle a single code block", () => {
    const input = "```python\n    print('Hello, world!')\n```";
    const expectedOutput: MessageBlock[] = [
      {
        type: "code",
        content: "    print('Hello, world!')",
        languageId: "python",
      } as CodeBlock,
    ];
    const actualOutput = stringToMessageBlocks(input);
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });

  test("stringMessageBlocks shoudd throw an error if the number of code fences is odd", () => {
    const input =
      "Words here!\n```python\n    print('Hello, world!')\n```\nMore words here!\n```";
    assert.throws(() => stringToMessageBlocks(input));
  });

  test("stringMessageBlocks should throw an error if only one code fence is present", () => {
    const input = "```python\n    print('Hello, world!')\n";
    assert.throws(() => stringToMessageBlocks(input));
  });

  test("stringMessageBlocks should throw an error if give only a code fence", () => {
    const input = "```";
    assert.throws(() => stringToMessageBlocks(input));
  });

  test("stringMessageBlocks should handle a single code block with no language identifier", () => {
    const input = "```\n    print('Hello, world!')\n```";
    const expectedOutput: MessageBlock[] = [
      {
        type: "code",
        content: "    print('Hello, world!')",
        languageId: undefined,
      } as CodeBlock,
    ];
    const actualOutput = stringToMessageBlocks(input);
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });

  test("stringMessageBlocks should handle multiple text and code blocks", () => {
    const input =
      "Words here!\n```python\n    print('Hello, world!')\n```\nMore words here!\n```\n    print('Goodbye, world!')\n    print('Actually, hello again!)\n```";
    const expectedOutput: MessageBlock[] = [
      { type: "text", content: "Words here!" } as TextBlock,
      {
        type: "code",
        content: "    print('Hello, world!')",
        languageId: "python",
      } as CodeBlock,
      { type: "text", content: "More words here!" } as TextBlock,
      {
        type: "code",
        content:
          "    print('Goodbye, world!')\n    print('Actually, hello again!)",
        languageId: undefined,
      } as CodeBlock,
    ];
    const actualOutput = stringToMessageBlocks(input);
    assert.deepStrictEqual(actualOutput, expectedOutput);
  });
});
