import { useState } from "react";
import { Chat } from "../../../../shared/types";
import Stack from "../Stack";
import { ChatInChatList } from "./ChatInChatList";
// import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Chat[];
}

export const ChatList = ({ chatList }: ChatListProps) => {

  const [editableIndex, setEditableIndex] = useState<number | null>(null);

  const listHandleEdit = (index: number) => {
    setEditableIndex(index)
  }

  const listHandleSave = () => {
    setEditableIndex(null);
};

  return (
    <Stack>
      {chatList.length > 0 ? (
        chatList.map((chat: Chat, i: number) => (
          <ChatInChatList 
            chat={chat} 
            onEdit={() => listHandleEdit(i)} 
            onSave={() => listHandleSave()}
            currEditableIndex={editableIndex}
            index={i}
          />
        ))
      ) : (
        <span>No chats found</span>
      )}
    </Stack>
  );
};
