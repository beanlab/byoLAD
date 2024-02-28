import { Chat } from "../../../../shared/types";
import { ChatList } from "./ChatList";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";
import { useAppContext } from "../../utilities/AppContext";

export const ChatListView = () => {
  const { setActiveViewAsChat, chatList } = useAppContext();
  const { createNewChat } = useExtensionMessageContext();

  if (chatList.length === 0) {
    createNewChat();
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Chat History</h2>
      </div>
      <ChatList
        chatList={chatList}
        handleChatClick={(chat: Chat) => setActiveViewAsChat(chat)}
      ></ChatList>
    </div>
  );
};
