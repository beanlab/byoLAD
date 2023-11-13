import { UserIcon } from "./UserIcon";
import byo_LAD from "../circle_byo_LAD.png";
import { ChatMessage, ChatRole } from "../utilities/ChatModel";

interface ChatMessageProps {
  chatMessage: ChatMessage;
}

export const ChatMessageView = ({
  chatMessage: { content, role },
}: ChatMessageProps) => {
  return (
    <div key={content[0].content || "1st"} className="chat-text">
      {role === ChatRole.User ? (
        <UserIcon />
      ) : (
        <img className="byoLAD" src={byo_LAD} alt="byoLAD" />
      )}
      <div className="chat-text2">
        {content.map((curr) => {
          return <div>{curr.content}</div>;
        })}
      </div>
    </div>
  );
};
