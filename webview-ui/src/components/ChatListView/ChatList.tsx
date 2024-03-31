import { Chat } from "../../../../shared/types";
import Stack from "../Stack";
import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Chat[];
}

export const ChatList = ({ chatList }: ChatListProps) => {
  return (
    <Stack>
      {chatList.length > 0 ? (
        chatList.map((chat: Chat, i: number) => (
          <ChatInChatList chat={chat} key={i}></ChatInChatList>
        ))
      ) : (
        <span>No chats found</span>
      )}
    </Stack>
  );
};
