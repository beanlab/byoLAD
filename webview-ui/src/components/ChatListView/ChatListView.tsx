import { Chat } from "../../../../shared/types";
import { ExtensionMessenger } from "../../utilities/ExtensionMessenger";
import { ChatList } from "./ChatList";
import { NavBar } from "../NavBar";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
  createNewChat: () => void;
}

export const ChatListView = ({
  chatList,
  changeActiveChat,
  createNewChat,
}: ChatListProps) => {
  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  const handleDeleteChat = (chat: Chat) => {
    // This updates the backend, which then posts a message to the front end
    // and then the front end does a setState() for chats
    ExtensionMessenger.deleteChat(chat.id);
  };

  const handleTitleChange = (chat: Chat, newTitle: string) => {
    // extensionMessenger.editTitleOfChat(chat.id, newTitle)
    chat.title = newTitle;
    ExtensionMessenger.updateChat(chat);
  };

  if (chatList.length === 0) {
    ExtensionMessenger.newChat();
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <div className="delete-all">
        <VSCodeButton onClick={ExtensionMessenger.deleteAllChats}>
          Delete All Chats
        </VSCodeButton>
      </div> */}

      {/* <ChatListHeader
        onClick={createNewChat}
      ></ChatListHeader> */}

      <NavBar
        showBackButton={false}
        changeActiveChat={changeActiveChat}
        createNewChat={createNewChat}
      />

      <ChatList
        chatList={chatList}
        handleChatClick={handleOnClick}
        handleDeleteClick={handleDeleteChat}
        handleTitleChange={handleTitleChange}
      ></ChatList>
    </div>
  );
};
