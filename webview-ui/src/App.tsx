import "./App.css";
import { useState } from "react";
import { Chat } from "./utilities/ChatModel";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import {
  ExtensionToWebviewMessage,
  UpdateChatMessageParams,
  UpdateChatListMessageParams,
  ErrorResponseMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ChatList } from "./components/ChatList";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";

function App() {
  const [fetchChats, setFetchChats] = useState<boolean>(true);
  const [chatList, setChatList] = useState<Chat[] | undefined>(undefined);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const changeActiveChat = (chat: Chat | null) => {
    extensionMessenger.setActiveChat(chat);
    setActiveChat(chat);
    setErrorMessage(null);
  };

  if (fetchChats) {
    setFetchChats(false);
    extensionMessenger.getChats();
  }

  /**
   * Handle messages sent from the extension to the webview
   */
  window.addEventListener("message", (event) => {
    const message = event.data as ExtensionToWebviewMessage;
    switch (message.messageType) {
      case "updateChat": {
        const params = message.params as UpdateChatMessageParams;
        const chats = params.chats;
        const activeChatId = params.activeChatId;
        setChatList(chats);
        if (activeChatId) {
          const activeChat =
            chats.find((chat) => chat.id === activeChatId) || null;
          setActiveChat(activeChat);
        } else if (activeChat) {
          const newActiveChat = chats.find((chat) => chat.id === activeChat.id);
          if (newActiveChat) {
            setActiveChat(newActiveChat);
          }
        }
        setLoadingMessage(false);
        setErrorMessage(null);
        break;
      }
      case "updateChatList": {
        const params = message.params as UpdateChatListMessageParams;
        const chats = params.chats;
        setChatList(chats);
        break;
      }
      case "errorResponse": {
        const params = message.params as ErrorResponseMessageParams;
        setLoadingMessage(false);
        setErrorMessage(params.errorMessage);
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
          errorMessage={errorMessage}
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
