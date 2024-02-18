import { Chat } from "../../../../shared/types";
import { ChatList } from "./ChatList";
import { NavBar } from "../NavBar";
import { useExtensionMessageContext } from "../../utilities/ExtensionChatContext";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
}

export const ChatListView = ({ chatList, changeActiveChat }: ChatListProps) => {
  const { createNewChat, deleteChat, updateChat } =
    useExtensionMessageContext();

  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  const handleDeleteChat = (chat: Chat) => {
    // This updates the backend, which then posts a message to the front end
    // and then the front end does a setState() for chats
    deleteChat(chat.id);
  };

  const handleTitleChange = (chat: Chat, newTitle: string) => {
    // extensionMessenger.editTitleOfChat(chat.id, newTitle)
    chat.title = newTitle;
    updateChat(chat);
  };

  if (chatList.length === 0) {
    createNewChat();
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar showBackButton={false} changeActiveChat={changeActiveChat} />

      <ChatList
        chatList={chatList}
        handleChatClick={handleOnClick}
        handleDeleteClick={handleDeleteChat}
        handleTitleChange={handleTitleChange}
      ></ChatList>
    </div>
  );
};
