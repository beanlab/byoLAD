import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import byo_LAD_icon from "../circle_byo_LAD.png";
import { UserIcon } from "./UserIcon";
import { ChatRole, CodeBlock, MessageBlock } from "../utilities/ChatModel";

interface MessageProps {
  role: ChatRole;
  messageBlocks: MessageBlock[];
}
export const Message: React.FC<MessageProps> = ({ role, messageBlocks }) => {
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
}
const CodeMessageBlock: React.FC<CodeMessageBlockProps> = ({
  languageId,
  children,
}) => {
  if (!languageId) {
    let markdown: string = "```";
    markdown += "\n" + children + "\n```";
    return <Markdown>{markdown}</Markdown>;
  } else {
    const markdown = children;
    return (
      <SyntaxHighlighter language={languageId} style={darcula}>
        {markdown}
      </SyntaxHighlighter>
    );
  }
};

interface MessageHeaderProps {
  role: ChatRole;
}
const MessageHeader: React.FC<MessageHeaderProps> = ({ role }) => {
  switch (role) {
    case ChatRole.User:
      return (
        <div className="header">
          <UserIcon />
          <div className="role-name">You</div>
        </div>
      );
    case ChatRole.Assistant:
      return (
        <div className="header">
          <img src={byo_LAD_icon} alt="byoLAD" className="assistant-icon" />
          <div className="role-name">byoLAD</div>
        </div>
      );
    case ChatRole.System:
      throw new Error("System messages should not be displayed");
    default:
      return null;
  }
};
