import { Chat } from "../../../../shared/types";
import { ChatList } from "./ChatList";
import { NavBar } from "../NavBar";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
}

export const ChatListView = ({ chatList, changeActiveChat }: ChatListProps) => {
  const { createNewChat } = useExtensionMessageContext();

  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  if (chatList.length === 0) {
    createNewChat();
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar showBackButton={false} changeActiveChat={changeActiveChat} />
      <ChatList chatList={chatList} handleChatClick={handleOnClick}></ChatList>
    </div>
  );
};
