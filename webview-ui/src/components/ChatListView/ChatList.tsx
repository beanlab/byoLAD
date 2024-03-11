import { Chat } from "../../../../shared/types";
import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Chat[];
}

export const ChatList = ({ chatList }: ChatListProps) => {
  return (
    <>
      {chatList.length > 0 ? (
        chatList.map((chat: Chat, i: number) => (
          <ChatInChatList chat={chat} key={i}></ChatInChatList>
        ))
      ) : (
        <span>No chats found</span>
      )}
    </>
  );
};
