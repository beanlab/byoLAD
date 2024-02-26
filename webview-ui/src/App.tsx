import "./App.css";
import { useEffect, useState } from "react";
import { Chat, ExtensionToWebviewMessage, Persona } from "../../shared/types";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import { ChatView } from "./components/ChatView";
import { WebviewToExtensionMessageSender } from "./utilities/WebviewToExtensionMessageSender";
import { ExtensionToWebviewMessageHandler } from "./utilities/ExtensionToWebviewMessageHandler";
import { ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { ChatListView } from "./components/ChatListView/ChatListView";
import { ExtensionMessageContextProvider } from "./utilities/ExtensionMessageContext";

function App() {
  const [chatList, setChatList] = useState<Chat[] | undefined>(undefined);
  const [personaList, setPersonaList] = useState<Persona[] | undefined>(
    undefined,
  );
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [defaultPersonaId, setDefaultPersonaId] = useState<number | undefined>(
    undefined,
  );
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSelection, setHasSelection] = useState<boolean>(false);

  const imagePaths: ImagePaths = window.initialState?.imagePaths;

  const theme = getVsCodeThemeFromCssClasses(document.body.className);
  const [vsCodeTheme, setVsCodeTheme] = useState(theme || VsCodeTheme.Dark);

  const webviewToExtensionMessageSender = new WebviewToExtensionMessageSender();
  const extenionToWebviewMessageHandler = new ExtensionToWebviewMessageHandler(
    setChatList,
    setPersonaList,
    setActiveChat,
    setDefaultPersonaId,
    setLoadingMessage,
    setErrorMessage,
    setHasSelection,
  );

  // Run 1x on mount
  // Adding the event listener here prevents receiving the same message multiple times
  useEffect(() => {
    // Get initial state from the extension
    webviewToExtensionMessageSender.getChats();
    webviewToExtensionMessageSender.getHasSelection();

    /**
     * Handle messages sent from the extension to the webview
     */
    const eventListener = (event: MessageEvent<ExtensionToWebviewMessage>) => {
      const message = event.data as ExtensionToWebviewMessage;
      extenionToWebviewMessageHandler.handleMessage(message);
    };
    window.addEventListener("message", eventListener);
    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, []);

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
    webviewToExtensionMessageSender.setActiveChat(chat);
    setActiveChat(chat);
    setErrorMessage(null);
  };

  const changeDefaultPersonaId = (id: number) => {
    webviewToExtensionMessageSender.setDefaultPersonaId(id);
    setDefaultPersonaId(id);
  };

  const changeChatPersonaId = (chat: Chat, id: number) => {
    chat.personaId = id;
    webviewToExtensionMessageSender.updateChat(chat);
  };

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      <ExtensionMessageContextProvider
        webviewToExtensionMessageSender={webviewToExtensionMessageSender}
      >
        {activeChat && personaList && defaultPersonaId ? (
          <ChatView
            imagePaths={imagePaths}
            activeChat={activeChat}
            personaList={personaList}
            errorMessage={errorMessage}
            hasSelection={hasSelection}
            loadingMessageState={{ loadingMessage, setLoadingMessage }}
            changeActiveChat={changeActiveChat}
            changeChatPersonaId={changeChatPersonaId}
          />
        ) : chatList && personaList && defaultPersonaId ? (
          // When there is no active chat, show the list of chats
          // But, only if the chatList/personaList has been fetched, otherwise show a loading message
          <ChatListView
            chatList={chatList}
            changeActiveChat={changeActiveChat}
            personasList={personaList}
            defaultPersonaId={defaultPersonaId}
            changeDefaultPersonaId={changeDefaultPersonaId}
          />
        ) : (
          <div className="loading-indicator">
            <VSCodeProgressRing></VSCodeProgressRing>
          </div>
        )}
      </ExtensionMessageContextProvider>
    </VsCodeThemeContext.Provider>
  );
}

export default App;
