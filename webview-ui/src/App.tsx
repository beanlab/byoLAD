import "./App.css";
import { useState } from "react";
import { Conversation } from "./utilities/ChatModel";
import {
  ExtensionToWebviewMessage,
  UpdateConversationMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ChatList } from "./components/ChatList";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ImagePaths } from "./types";

function App() {
  const [fetchConversations, setFetchConversations] = useState<boolean>(true);
  const [chatList, setChatList] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  const extensionMessenger = new ExtensionMessenger();
  const imagePaths: ImagePaths = window.initialState?.imagePaths;

  const changeActiveChat = (conversation: Conversation | null) => {
    extensionMessenger.setActiveChat(conversation);
    setActiveChat(conversation);
  };

  if (fetchConversations) {
    setFetchConversations(false);
    extensionMessenger.getConversations();
  }

  /**
   * Handle messages sent from the extension to the webview
   */
  window.addEventListener("message", (event) => {
    const message = event.data as ExtensionToWebviewMessage;
    switch (message.messageType) {
      case "updateConversation": {
        const params = message.params as UpdateConversationMessageParams;
        const conversations = params.conversations;
        const activeConversationId = params.activeConversationId;
        setChatList(conversations);
        if (activeConversationId) {
          const activeConversation =
            conversations.find(
              (conversation) => conversation.id === activeConversationId,
            ) || null;
          setActiveChat(activeConversation);
        } else if (activeChat) {
          const newActiveChat = conversations.find(
            (conversation) => conversation.id === activeChat.id,
          );
          if (newActiveChat) {
            setActiveChat(newActiveChat);
          }
        }
        break;
      }
      default:
        // TODO: How to handle?
        console.log("Unknown event 'message' received: ", event);
        break;
    }
  });

  if (activeChat) {
    return (
      <ChatView
        activeChat={activeChat}
        changeActiveChat={changeActiveChat}
        imagePaths={imagePaths}
      />
    );
  } else {
    return <ChatList chatList={chatList} changeActiveChat={changeActiveChat} />;
  }
}

export default App;
