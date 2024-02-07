import "./App.css";
import { useEffect, useState } from "react";
import { Chat } from "./utilities/ChatModel";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import {
  ExtensionToWebviewMessage,
  UpdateChatMessageParams,
  UpdateChatListMessageParams,
  ErrorResponseMessageParams,
  SetLoadingParams,
  UpdateHasSelectionMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { ChatListView } from "./components/ChatListView/ChatListView";


function App() {
  const [chatList, setChatList] = useState<Chat[] | undefined>(undefined);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const extensionMessenger = new ExtensionMessenger();
  const imagePaths: ImagePaths = window.initialState?.imagePaths;

  const theme = getVsCodeThemeFromCssClasses(document.body.className);
  const [vsCodeTheme, setVsCodeTheme] = useState(theme || VsCodeTheme.Dark);

  // Run 1x on mount
  useEffect(() => {
    extensionMessenger.getChats();
    extensionMessenger.getHasSelection();
  }, []);

  
  const createNewChat = () => {
    extensionMessenger.newChat();
  }

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

  /**
   * Handle messages sent from the extension to the webview
   */
  window.addEventListener("message", (event) => {
    const message = event.data as ExtensionToWebviewMessage;
    switch (message.messageType) {
      case "setLoading": {
        const params = message.params as SetLoadingParams;
        setLoadingMessage(params.loading);
        break;
      }
      case "updateChat": {
        const params = message.params as UpdateChatMessageParams;

        setChatList(params.chats);

        if (params.activeChatId) {
          const newActiveChat: Chat | null =
            params.chats.find((chat) => chat.id === params.activeChatId) ||
            null;
          setActiveChat(newActiveChat);
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
      case "updateHasSelection": {
        const params = message.params as UpdateHasSelectionMessageParams;
        setHasSelection(params.hasSelection);
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
          hasSelection={hasSelection}
          createNewChat={createNewChat}
        />
      ) : chatList ? (
        // When there is no active chat, show the list of chats
        // But, only if the chatList has been fetched, otherwise show a loading message
        <ChatListView chatList={chatList} changeActiveChat={changeActiveChat} createNewChat={createNewChat} />
      ) : (
        <div className="loading-indicator">
          <VSCodeProgressRing></VSCodeProgressRing>
        </div>
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
