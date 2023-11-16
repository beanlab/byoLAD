import "./App.css";
import { useState } from "react";
import { Conversation } from "./utilities/ChatModel";
import {
  ExtensionToWebviewMessage,
  RefreshChatMessageParams,
  UpdateConversationMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ChatList } from "./components/ChatList";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";

function App() {
  const [fetchConversations, setFetchConversations] = useState<boolean>(true);
  const [chatList, setChatList] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);

  const extensionMessenger = new ExtensionMessenger();

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
      case "refreshChat": {
        const params = message.params as RefreshChatMessageParams;
        const conversation = params.activeConversation as Conversation | null;
        console.log("Active Conversation: ", conversation);
        // TODO: Handle refresh request (which contains the contents of the active conversation, including any messages that have just been received)
        // Display the new messages from the model or completely change the chat history in line with the provided active conversation
        // How should we display there being no active conversation? Should that even be an option or should there always have to be something?
        break;
      }
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
      <ChatView activeChat={activeChat} changeActiveChat={changeActiveChat} />
    );
  } else {
    return <ChatList chatList={chatList} changeActiveChat={changeActiveChat} />;
  }
}

export default App;
