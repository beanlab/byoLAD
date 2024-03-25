import { ChatRole, CodeBlock, MessageBlock } from "../../../shared/types";
import { ByoLadIconAdaptiveTheme } from "./ByoLadIconAdaptiveTheme";
import { CodeMessageBlock, TextMessageBlock } from "./MessageBlock";

interface MessageProps {
  role: ChatRole;
  messageBlocks: MessageBlock[];
  deleteMessageBlock: (messageBlockPosition: number) => void;
}

/**
 * A single message in a chat consisting of one or more message blocks.
 */
export const Message: React.FC<MessageProps> = ({
  role,
  messageBlocks,
  deleteMessageBlock,
}) => {
  return (
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
      console.error("System messages should not be displayed");
      return <></>;
    default:
      return <></>;
  }
};
