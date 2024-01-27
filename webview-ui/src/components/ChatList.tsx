import { Conversation } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";
import { ChatInChatList } from "./ChatInChatList";


interface ChatListProps {
  chatList: Conversation[];
  changeActiveChat: (conversation: Conversation | null) => void;
}

export const ChatList = ({ chatList, changeActiveChat }: ChatListProps) => {
  const extensionMessenger = new ExtensionMessenger();

  if (chatList.length === 0) {
    extensionMessenger.newConversation();
    return <div>Loading...</div>;
  }

  const handleOnClick = (conversation: Conversation) => {
    changeActiveChat(conversation);
  };

  return (
    <div>
      {/* <div className="delete-all">
        <VSCodeButton onClick={extensionMessenger.deleteAllConversations}>
          Delete All Conversations
        </VSCodeButton>
      </div> */}
      <VSCodeBadge className="navbar">
        <VSCodeButton
          appearance="icon"
          aria-label="New conversation"
          title="New conversation"
          onClick={extensionMessenger.newConversation}
        >
          <i className="codicon codicon-add"></i>
        </VSCodeButton>
      </VSCodeBadge>
      {/* {listOfChats} */}

      {chatList.map((conversation, i) => (
        <ChatInChatList
            conversation={conversation}
            extensionMessenger={extensionMessenger}
            handleClick={handleOnClick}
            id={i}   
        ></ChatInChatList>))}
    
    </div>
  );
};
