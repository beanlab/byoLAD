import "./App.css";
import { useEffect, useState } from "react";
import {
  Chat,
  ExtensionToWebviewMessage,
  ExtensionToWebviewMessageTypeParamsMap,
} from "../../shared/types";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
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

  const imagePaths: ImagePaths = window.initialState?.imagePaths;

  const theme = getVsCodeThemeFromCssClasses(document.body.className);
  const [vsCodeTheme, setVsCodeTheme] = useState(theme || VsCodeTheme.Dark);

  // Run 1x on mount
  // Adding the event listener here prevents receiving the same message multiple times
  useEffect(() => {
    ExtensionMessenger.getChats();
    ExtensionMessenger.getHasSelection();

    /**
     * Handle messages sent from the extension to the webview
     */
    const eventListener = (event: MessageEvent<ExtensionToWebviewMessage>) => {
      const message = event.data as ExtensionToWebviewMessage;
      switch (message.messageType) {
        case "isMessageLoading": {
          const params =
            message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
          setLoadingMessage(params.isLoading);
          break;
        }
        case "refresh": {
          const params =
            message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
          setChatList(params.chats);
          const newActiveChat: Chat | null =
            params.chats.find((chat) => chat.id === params.activeChatId) ||
            null;
          setActiveChat(newActiveChat);
          break;
        }
        case "errorMessage": {
          const params =
            message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
          setLoadingMessage(false);
          setErrorMessage(params.errorMessage);
          break;
        }
        case "hasSelection": {
          const params =
            message.params as ExtensionToWebviewMessageTypeParamsMap[typeof message.messageType];
          setHasSelection(params.hasSelection);
          break;
        }
        default: {
          // Ensure exhaustive switch. Make sure all message types are handled in the switch statement.
          const _exhaustiveCheck: never = message.messageType;
          throw new Error(`Unknown message type: ${_exhaustiveCheck}`);
        }
      }
    };
    window.addEventListener("message", eventListener);
    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, []);

  const createNewChat = () => {
    ExtensionMessenger.newChat();
  };

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
    ExtensionMessenger.setActiveChat(chat);
    setActiveChat(chat);
    setErrorMessage(null);
  };

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
        <ChatListView
          chatList={chatList}
          changeActiveChat={changeActiveChat}
          createNewChat={createNewChat}
        />
      ) : (
        <div className="loading-indicator">
          <VSCodeProgressRing></VSCodeProgressRing>
        </div>
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
