import "./App.css";

import { useEffect, useState } from "react";

import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

import {
  Chat,
  ExtensionToWebviewMessage,
  ImagePaths,
  Persona,
} from "../../shared/types";
import { ChatListView } from "./components/ChatListView/ChatListView";
import { ChatView } from "./components/ChatView";
import { PersonaSettings } from "./components/SettingsView/PersonaSettings";
import { AppView, VsCodeTheme } from "./types";
import { AppContext } from "./utilities/AppContext";
import { ExtensionMessageContextProvider } from "./utilities/ExtensionMessageContext";
import { ExtensionToWebviewMessageHandler } from "./utilities/ExtensionToWebviewMessageHandler";
import {
  getVsCodeThemeFromCssClasses,
  VsCodeThemeContext,
} from "./utilities/VsCodeThemeContext";
import { WebviewToExtensionMessageSender } from "./utilities/WebviewToExtensionMessageSender";

function App() {
  const [appView, setAppView] = useState(AppView.Chat);
  const [chatList, setChatList] = useState<Chat[] | undefined>(undefined);
  const [personaList, setPersonaList] = useState<Persona[] | undefined>(
    undefined,
  );
  // ActiveChat: Null is for when there is no active chat, undefined is for when the active chat is not yet known (whether null or not)
  const [activeChat, setActiveChat] = useState<Chat | null | undefined>(
    undefined,
  );
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
    () => setAppView(AppView.Chat),
  );

  // Run 1x on mount
  // Adding the event listener here prevents receiving the same message multiple times
  useEffect(() => {
    // Get initial state from the extension
    webviewToExtensionMessageSender.requestRefresh();
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

  const navigateViews = (view: AppView, chat?: Chat) => {
    if (view === AppView.Chat && chat) {
      setActiveChat(chat);
      webviewToExtensionMessageSender.setActiveChat(chat);
    } else if (view === AppView.ChatList) {
      setActiveChat(null);
      webviewToExtensionMessageSender.setActiveChat(null);
    }
    setAppView(view);
  };

  return (
    <VsCodeThemeContext.Provider value={vsCodeTheme}>
      {/* Loading indicator unless the necessary data has already loaded */}
      {chatList &&
      personaList &&
      defaultPersonaId &&
      activeChat !== undefined ? (
        <AppContext.Provider
          value={{
            appView,
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
              {appView === AppView.ChatList ? (
                <ChatListView />
              ) : appView === AppView.Chat ? (
                <ChatView
                  imagePaths={imagePaths}
                  errorMessage={errorMessage}
                  hasSelection={hasSelection}
                  loadingMessageState={{ loadingMessage, setLoadingMessage }}
                />
              ) : appView === AppView.Settings ? (
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
          <VSCodeProgressRing />
        </div>
      )}
    </VsCodeThemeContext.Provider>
  );
}

export default App;
