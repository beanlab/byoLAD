import byo_LAD_icon from "../circle_byo_LAD.png";
import { UserIcon } from "./UserIcon";
import { ChatRole, MessageBlock } from "../utilities/ChatModel";
import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";

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
        {messageBlocks.map((messageBlock) => (
          <Block messageBlock={messageBlock} />
        ))}
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
        <div className="header">
          {/* <img src={user_icon} alt={"user"} className="user-icon" /> */}
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

interface BlockProps {
  messageBlock: MessageBlock;
}
const Block: React.FC<BlockProps> = ({ messageBlock }) => (
  <div className="message-block">{messageBlock.content}</div>
);
