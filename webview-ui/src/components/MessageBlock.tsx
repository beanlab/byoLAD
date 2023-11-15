import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import Markdown from "react-markdown";

interface CodeMessageBlockProps {
  languageId: string | undefined;
  children: string;
  extensionMessenger: ExtensionMessenger;
}
export const CodeMessageBlock: React.FC<CodeMessageBlockProps> = ({
  languageId,
  children,
  extensionMessenger,
}) => {
  const content: string = children;
  const noMargin = {
    margin: 0,
  };

  return (
    <div className="code-block-container">
      {languageId ? (
        <SyntaxHighlighter
          language={languageId}
          style={darcula}
          customStyle={noMargin}
        >
          {content}
        </SyntaxHighlighter>
      ) : (
        <Markdown>{"```" + languageId + "\n" + content + "\n```"}</Markdown>
      )}
      <div className="code-button-container">
        <VSCodeButton
          appearance="icon"
          aria-label="Copy to clipboard"
          title="Copy to clipboard"
          onClick={() => extensionMessenger.copyToClipboard(content)}
        >
          <span className="codicon codicon-copy"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="Insert at cursor"
          title="Insert at cursor"
          onClick={() => extensionMessenger.insertCodeBlock(content)}
        >
          <span className="codicon codicon-insert"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="View diff in editor"
          title="View diff in editor"
          onClick={() => extensionMessenger.diffClodeBlock(content)}
        >
          <span className="codicon codicon-diff"></span>
        </VSCodeButton>
      </div>
    </div>
  );
};

interface TextMessageBlockProps {
  children: string;
}
export const TextMessageBlock: React.FC<TextMessageBlockProps> = ({
  children,
}) => {
  return <Markdown>{children}</Markdown>;
};
