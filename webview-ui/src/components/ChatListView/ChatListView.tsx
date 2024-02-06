import { Conversation } from "../../utilities/ChatModel";
import { ExtensionMessenger } from "../../utilities/ExtensionMessenger";
import { ChatList } from "./ChatList";
import { ChatListHeader } from "./ChatListHeader";

interface ChatListProps {
  chatList: Conversation[];
  changeActiveChat: (conversation: Conversation | null) => void;
}

export const ChatListView = ({ chatList, changeActiveChat }: ChatListProps) => {
  const extensionMessenger = new ExtensionMessenger();

  const createNewConversation = () => {
    extensionMessenger.newConversation();
  }

  const handleOnClick = (conversation: Conversation) => {
    changeActiveChat(conversation);
  };

  const handleDeleteChat = (conversation: Conversation) => {
    // This updates the backend, which then posts a message to the front end
    // and then the front end does a setState() for conversations
    extensionMessenger.deleteConversation(conversation.id);
  }

  const handleTitleChange = (conversation: Conversation, newTitle: string) => {
    // extensionMessenger.editTitleOfChat(conversation.id, newTitle)
    conversation.title = newTitle
    extensionMessenger.updateChat(conversation)

  }

  if (chatList.length === 0) {
    extensionMessenger.newConversation();
    return <div>Loading...</div>;
  }
  


  return (
    <div>
      {/* <div className="delete-all">
        <VSCodeButton onClick={extensionMessenger.deleteAllConversations}>
          Delete All Conversations
        </VSCodeButton>
      </div> */}

      <ChatListHeader
        onClick={createNewConversation}
      ></ChatListHeader>

      <ChatList
        chatList={chatList}
        handleConversationClick={handleOnClick}
        handleDeleteClick={handleDeleteChat}
        handleTitleChange={handleTitleChange}
      ></ChatList>

    </div>
  );
};