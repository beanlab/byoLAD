import { VSCodeButton, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ChatRole, CodeBlock, MessageBlock } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";

interface MessageProps {
  role: ChatRole;
  messageBlocks: MessageBlock[];
  extensionMessenger: ExtensionMessenger;
}
export const Message: React.FC<MessageProps> = ({
  role,
  messageBlocks,
  extensionMessenger,
}) => {
  return (
    <div>
      <VSCodeDivider role="separator" />
      <div className="message">
        <MessageHeader role={role} />
        <div className="message-block">
          {messageBlocks.map((messageBlock) => {
            if (messageBlock.type === "text") {
              return (
                <TextMessageBlock>{messageBlock.content}</TextMessageBlock>
              );
            } else if (messageBlock.type === "code") {
              return (
                <CodeMessageBlock
                  languageId={(messageBlock as CodeBlock).languageId}
                  extensionMessenger={extensionMessenger}
                >
                  {messageBlock.content}
                </CodeMessageBlock>
              );
            } else {
              throw new Error("Unknown message block type");
            }
          })}
        </div>
      </div>
    </div>
  );
};

interface TextMessageBlockProps {
  children: string;
}
const TextMessageBlock: React.FC<TextMessageBlockProps> = ({ children }) => {
  return <Markdown>{children}</Markdown>;
};

interface CodeMessageBlockProps {
  languageId: string | undefined;
  children: string;
  extensionMessenger: ExtensionMessenger;
}
const CodeMessageBlock: React.FC<CodeMessageBlockProps> = ({
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
          onClick={() => copyToClipboard(content, extensionMessenger)}
        >
          <span className="codicon codicon-copy"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="Insert at cursor"
          title="Insert at cursor"
          onClick={() => insertIntoEditor(content, extensionMessenger)}
        >
          <span className="codicon codicon-insert"></span>
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="View diff in editor"
          title="View diff in editor"
          onClick={() => diffInEditor(content, extensionMessenger)}
        >
          <span className="codicon codicon-diff"></span>
        </VSCodeButton>
      </div>
    </div>
  );
};

interface MessageHeaderProps {
  role: ChatRole;
}
const MessageHeader: React.FC<MessageHeaderProps> = ({ role }) => {
  switch (role) {
    case ChatRole.User:
      return (
        <div className="message-header">
          <i className="codicon codicon-account"></i>
          <div className="role-name">You</div>
        </div>
      );
    case ChatRole.Assistant:
      return (
        <div className="message-header">
          <i className="codicon codicon-hubot"></i>
          <div className="role-name">byoLAD</div>
        </div>
      );
    case ChatRole.System:
      throw new Error("System messages should not be displayed");
    default:
      return null;
  }
};

function copyToClipboard(
  content: string,
  extensionMessenger: ExtensionMessenger,
): void {
  console.log(extensionMessenger); // TODO: DELETE ME
  if (navigator.clipboard) {
    navigator.clipboard.writeText(content);
  } else {
    console.log("Clipboard API not available"); // TODO: Handle
  }
}

function insertIntoEditor(
  content: string,
  extensionMessenger: ExtensionMessenger,
): void {
  console.log(extensionMessenger); // TODO: DELETE ME
  console.log(content); // TODO: DELETE ME
}

function diffInEditor(
  content: string,
  extensionMessenger: ExtensionMessenger,
): void {
  extensionMessenger.diffClodeBlock(content);
}
