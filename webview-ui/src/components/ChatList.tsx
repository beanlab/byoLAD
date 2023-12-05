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
    let name = conversation.name;
    if (conversation.messages.length === 0) {
      name = "Empty Chat";
    } 
    else if (conversation.messages[0].content[0].type !== "code") {
      console.log("in here");
      name = conversation.messages[0].content[0].content;
      console.log(name);
    } else {
      name = "undefined";
      const temp = conversation.messages[1].content[0].content;
      const temp2 = temp.split(".");
      name = temp2[0];
    }
    return (
      <div className="convo">
        <div
          onClick={() => handleOnClick(conversation)}
          key={conversation.id}
          className="convo-id"
        >
          {name}
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
