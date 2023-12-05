import { Conversation } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";

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

  const listOfChats = chatList.map((conversation) => {
    return (
      <div className="convo">
        <div
          onClick={() => handleOnClick(conversation)}
          key={conversation.id}
          className="convo-id"
        >
          {conversation.id}
        </div>
        <VSCodeButton
          appearance="icon"
          aria-label="Delete conversation"
          title="Delete conversation"
          onClick={() => extensionMessenger.deleteConversation(conversation.id)}
        >
          <i className="codicon codicon-trash"></i>
        </VSCodeButton>
      </div>
    );
  });

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
      {listOfChats}
    </div>
  );
};
