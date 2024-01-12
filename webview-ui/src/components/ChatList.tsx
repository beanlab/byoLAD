import { Chat } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";

interface ChatListProps {
  chatList: Chat[];
  changeActiveChat: (chat: Chat | null) => void;
}

/**
 * The chat history of the user from which they can select a chat to view.
 */
export const ChatList = ({ chatList, changeActiveChat }: ChatListProps) => {
  const extensionMessenger = new ExtensionMessenger();

  if (chatList.length === 0) {
    extensionMessenger.newChat();
    return <div>Loading...</div>;
  }

  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  const listOfChats = chatList.map((chat) => {
    let name = chat.name;
    if (chat.messages.length === 0) {
      name = "Empty Chat";
    } else if (chat.messages[0].content[0].type !== "code") {
      name = chat.messages[0].content[0].content;
    } else {
      name = "undefined";
      const temp = chat.messages[1].content[0].content;
      const temp2 = temp.split(".");
      name = temp2[0];
    }
    return (
      <div className="convo">
        <div
          onClick={() => handleOnClick(chat)}
          key={chat.id}
          className="convo-id"
        >
          {name}
        </div>
        <VSCodeButton
          appearance="icon"
          aria-label="Delete chat"
          title="Delete chat"
          onClick={() => extensionMessenger.deleteChat(chat.id)}
        >
          <i className="codicon codicon-trash"></i>
        </VSCodeButton>
      </div>
    );
  });

  return (
    <div>
      {/* <div className="delete-all">
        <VSCodeButton onClick={extensionMessenger.deleteAllChats}>
          Delete All Chats
        </VSCodeButton>
      </div> */}
      <VSCodeBadge className="navbar">
        <VSCodeButton
          appearance="icon"
          aria-label="New chat"
          title="New chat"
          onClick={extensionMessenger.newChat}
        >
          <i className="codicon codicon-add"></i>
        </VSCodeButton>
      </VSCodeBadge>
      {listOfChats}
    </div>
  );
};
