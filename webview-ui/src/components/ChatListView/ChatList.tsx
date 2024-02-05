import { Conversation } from "../../utilities/ChatModel";
import { ChatInChatList } from "./ChatInChatList";

interface ChatListProps {
  chatList: Conversation[];
  handleConversationClick: (conversation: Conversation) => void;
  handleDeleteClick: (conversation: Conversation) => void;
  handleTitleChange: (conversation:Conversation, newTitle: string) => void;
}


export const ChatList = ({ chatList, handleConversationClick, handleDeleteClick, handleTitleChange}: ChatListProps) => {
  return (
    <>
      {chatList.map((conversation, i) => (
        <ChatInChatList
            conversation={conversation}
            handleClick={handleConversationClick}
            handleDeleteClick={handleDeleteClick}
            handleTitleChange={handleTitleChange}
            id={i}   
        ></ChatInChatList>))}
    </>
)
} 