import "./App.css";
import { useState } from "react";
import { Conversation } from "./utilities/ChatModel";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import {
  ExtensionToWebviewMessage,
  UpdateConversationMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ChatView } from "./components/ChatView";
import { ChatList } from "./components/ChatList";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";

function App() {
  const [chatList, setChatList] = useState<Conversation[]>(
    window.initialState?.conversations || [],
  );

  const passedActiveConversationId = window.initialState?.activeConversationId;
  const [activeChat, setActiveChat] = useState<Conversation | null>(
    passedActiveConversationId
      ? chatList.find(
          (conversation) => conversation.id === passedActiveConversationId,
        ) || null
      : null,
  );

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

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      {activeChat ? (
        <ChatView
          activeChat={activeChat}
          changeActiveChat={changeActiveChat}
          imagePaths={imagePaths}
        />
      ) : (
        <ChatList chatList={chatList} changeActiveChat={changeActiveChat} />
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
