import "./App.css";
import { useEffect, useState } from "react";
import { Chat, ExtensionToWebviewMessage, Persona } from "../../shared/types";
import { VsCodeThemeContext } from "./utilities/VsCodeThemeContext";
import { ChatView } from "./components/ChatView";
import { WebviewToExtensionMessageSender } from "./utilities/WebviewToExtensionMessageSender";
import { ExtensionToWebviewMessageHandler } from "./utilities/ExtensionToWebviewMessageHandler";
import { ActiveView, ImagePaths, VsCodeTheme } from "./types";
import { getVsCodeThemeFromCssClasses } from "./utilities/VsCodeThemeContext";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { ChatListView } from "./components/ChatListView/ChatListView";
import { ExtensionMessageContextProvider } from "./utilities/ExtensionMessageContext";
import { PersonaSettings } from "./components/SettingsView/PersonaSettings";
import { AppContext } from "./utilities/AppContext";

function App() {
  const [activeView, setActiveView] = useState(ActiveView.Chat);
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
    () => setActiveView(ActiveView.Chat),
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

  const navigateViews = (view: ActiveView, chat?: Chat) => {
    if (view === ActiveView.Chat && chat) {
      setActiveChat(chat);
      webviewToExtensionMessageSender.setActiveChat(activeChat);
    } else if (view === ActiveView.ChatList) {
      setActiveChat(null);
      webviewToExtensionMessageSender.setActiveChat(null);
    }
    setActiveView(view);
  };

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      {/* Loading indicator unless the necessary data has already loaded */}
      {chatList && personaList && defaultPersonaId ? (
        <AppContext.Provider
          value={{
            activeView,
            navigate: navigateViews,
            chatList,
            setChatList,
            activeChat,
            setActiveChat,
            personaList,
            setPersonaList,
            defaultPersonaId,
          }}
        >
          <ExtensionMessageContextProvider
            webviewToExtensionMessageSender={webviewToExtensionMessageSender}
          >
            <div className="app-container">
              {activeView === ActiveView.ChatList ? (
                <ChatListView />
              ) : activeView === ActiveView.Chat ? (
                <ChatView
                  imagePaths={imagePaths}
                  errorMessage={errorMessage}
                  hasSelection={hasSelection}
                  loadingMessageState={{ loadingMessage, setLoadingMessage }}
                />
              ) : activeView === ActiveView.Settings ? (
                <PersonaSettings />
              ) : (
                <div>
                  Unexpected error. Please close and reopen the extension.
                </div>
              )}
            </div>
          </ExtensionMessageContextProvider>
        </AppContext.Provider>
      ) : (
        <div className="loading-indicator">
          <VSCodeProgressRing></VSCodeProgressRing>
        </div>
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
