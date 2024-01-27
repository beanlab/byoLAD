import "./App.css";
import { useState } from "react";
import { Conversation } from "./utilities/ChatModel";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import {
  ExtensionToWebviewMessage,
  UpdateConversationMessageParams,
  UpdateConversationListMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ChatList } from "./components/ChatList";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";


function App() {
  const [fetchConversations, setFetchConversations] = useState<boolean>(true);
  const [chatList, setChatList] = useState<Conversation[] | undefined>(
    undefined,
  );
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);

  const extensionMessenger = new ExtensionMessenger();
  const imagePaths: ImagePaths = window.initialState?.imagePaths;

  const theme = getVsCodeThemeFromCssClasses(document.body.className);
  const [vsCodeTheme, setVsCodeTheme] = useState(theme || VsCodeTheme.Dark);

  // Watches the <body> element of the webview for changes to its theme classes, tracking that state
  const mutationObserver = new MutationObserver(
    (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const theme = getVsCodeThemeFromCssClasses(document.body.className);
          if (theme !== undefined) {
            setVsCodeTheme(theme);
          }
          return;
        }
      });
    },
  );
  mutationObserver.observe(document.body, { attributes: true });

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
        setLoadingMessage(false);
        break;
      }
      case "updateConversationList": {
        const params = message.params as UpdateConversationListMessageParams;
        const conversations = params.conversations;
        setChatList(conversations);
        console.log("updated: ", conversations)
        break;
      }
      case "errorResponse": {
        setLoadingMessage(false);
        break;
      }
      default:
        // TODO: How to handle?
        console.log("Unknown event 'message' received: ", event);
        break;
    }
  });

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      {activeChat ? (
        <ChatView
          activeChat={activeChat}
          changeActiveChat={changeActiveChat}
          imagePaths={imagePaths}
          loadingMessage={loadingMessage}
          setLoadingMessage={setLoadingMessage}
        />
      ) : chatList ? (
        // When there is no active chat, show the list of chats
        // But, only if the chatList has been fetched, otherwise show a loading message
        <ChatList chatList={chatList} changeActiveChat={changeActiveChat} />
      ) : (
        <div>Loading...</div>
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
