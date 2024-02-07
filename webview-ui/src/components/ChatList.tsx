import { Chat } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import {
  VSCodeButton,
  VSCodeProgressRing,
} from "@vscode/webview-ui-toolkit/react";
import NavBar from "./NavBar";

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
    return (
      <div className="loading-indicator">
        <VSCodeProgressRing></VSCodeProgressRing>
      </div>
    );
  }

  const handleOnClick = (chat: Chat) => {
    changeActiveChat(chat);
  };

  const listOfChats = chatList.map((chat) => {
    console.log("chat: ", chat);
    const name = chat.name;
    // TODO: Change how chat names are defined and displayed
    // if (chat.messages.length === 0) {
    //   name = "Empty Chat";
    // } else if (chat.messages[0].content[0].type !== "code") {
    //   name = chat.messages[0].content[0].content;
    // } else {
    //   name = "undefined";
    //   console.log("chat.messages[1].content[0].content: ", chat.messages[1].content[0].content)
    //   const temp = chat.messages[1].content[0].content;
    //   const temp2 = temp.split(".");
    //   name = temp2[0];
    // }
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
    <div className="view-container">
      {/* <div className="delete-all">
        <VSCodeButton onClick={extensionMessenger.deleteAllChats}>
          Delete All Chats
        </VSCodeButton>
      </div> */}
      <NavBar showBackButton={false} changeActiveChat={changeActiveChat} />
      <div className="chat-list">{listOfChats}</div>
    </div>
  );
};
