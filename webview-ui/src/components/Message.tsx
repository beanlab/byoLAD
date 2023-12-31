import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { ChatRole, CodeBlock, MessageBlock } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { CodeMessageBlock } from "./MessageBlock";
import { TextMessageBlock } from "./MessageBlock";
import { ByoLadIconAdaptiveTheme } from "./ByoLadIconAdaptiveTheme";

interface MessageProps {
  role: ChatRole;
  messageBlocks: MessageBlock[];
  extensionMessenger: ExtensionMessenger;
  deleteMessageBlock: (messageBlockPosition: number) => void;
}

export const Message: React.FC<MessageProps> = ({
  role,
  messageBlocks,
  extensionMessenger,
  deleteMessageBlock,
}) => {
  return (
    <div>
      <VSCodeDivider role="separator" />
      <div className="message">
        <MessageHeader role={role} />
        <div className="message-blocks">
          {messageBlocks.map((messageBlock, position) => {
            if (messageBlock.type === "text") {
              return (
                <TextMessageBlock
                  deleteMessageBlock={() => deleteMessageBlock(position)}
                >
                  {messageBlock.content}
                </TextMessageBlock>
              );
            } else if (messageBlock.type === "code") {
              return (
                <CodeMessageBlock
                  languageId={(messageBlock as CodeBlock).languageId}
                  extensionMessenger={extensionMessenger}
                  deleteMessageBlock={() => deleteMessageBlock(position)}
                >
                  {messageBlock.content}
                </CodeMessageBlock>
              );
            } else {
              console.error(`Unknown message block type: ${messageBlock.type}`);
              return <></>;
            }
          })}
        </div>
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
          <ByoLadIconAdaptiveTheme />
          <div className="role-name">byoLAD</div>
        </div>
      );
    case ChatRole.System:
      console.log("System messages should not be displayed");
      return <></>;
    default:
      return <></>;
  }
};
