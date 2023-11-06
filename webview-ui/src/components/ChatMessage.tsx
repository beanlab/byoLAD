import { UserIcon } from "./UserIcon";
import { MessageType, Message } from "../types";
import byo_LAD from "../circle_byo_LAD.png";

interface ChatMessageProps {
  chatMessage: Message;
}

export const ChatMessage = ({
  chatMessage: { message, type },
}: ChatMessageProps) => {
  return (
    <div key={message} className="chat-text">
      {type === MessageType.User ? (
        <UserIcon />
      ) : (
        <img className="byoLAD" src={byo_LAD} alt="byoLAD" />
      )}
      <div className="chat-text2">{message}</div>
    </div>
  );
};
