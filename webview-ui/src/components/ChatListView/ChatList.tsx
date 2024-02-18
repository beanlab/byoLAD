import { Chat } from "../../../../shared/types";
import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Chat[];
  handleChatClick: (chat: Chat) => void;
}

export const ChatList = ({ chatList, handleChatClick }: ChatListProps) => {
  return (
    <>
      {chatList.map((chat, i) => (
        <ChatInChatList
          chat={chat}
          handleClick={handleChatClick}
          id={i}
        ></ChatInChatList>
      ))}
    </>
  );
};
