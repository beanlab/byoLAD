import { Chat } from "../../../../shared/types";
import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Chat[];
  handleChatClick: (chat: Chat) => void;
  handleDeleteClick: (chat: Chat) => void;
  handleTitleChange: (chat: Chat, newTitle: string) => void;
}

export const ChatList = ({
  chatList,
  handleChatClick,
  handleDeleteClick,
  handleTitleChange,
}: ChatListProps) => {
  return (
    <>
      {chatList.map((chat, i) => (
        <ChatInChatList
          chat={chat}
          handleClick={handleChatClick}
          handleDeleteClick={handleDeleteClick}
          handleTitleChange={handleTitleChange}
          id={i}
        ></ChatInChatList>
      ))}
    </>
  );
};
