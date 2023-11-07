import { Conversation } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";

interface ChatListProps {
  chatList: Conversation[];
  setActiveChat: (conversation: Conversation | null) => void;
}

export const ChatList = ({ chatList, setActiveChat }: ChatListProps) => {
  const extensionMessenger = new ExtensionMessenger();

  if (chatList.length === 0) {
    extensionMessenger.newConversation;
    return <div>There are no conversations</div>;
  }

  const handleOnClick = (conversation: Conversation) => {
    setActiveChat(conversation);
  };

  return (
    <>
      {chatList.map((conversation) => {
        return (
          <div
            onClick={() => handleOnClick(conversation)}
            key={conversation.id}
          >
            {conversation.id}
          </div>
        );
      })}
    </>
  );
};
