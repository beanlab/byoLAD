import { createContext, useContext } from "react";

import {
  Chat,
  ModelProvider,
  Persona,
  PersonaDraft,
} from "../../../shared/types";
import { WebviewToExtensionMessageSender } from "./WebviewToExtensionMessageSender";

type ExtensionMessageContextType = {
  createNewChat: () => void;
  updateChat: (chat: Chat) => void;
  deleteChat: (chatId: number) => void;
  addCodeToChat: () => void;
  sendChatMessage: (message: string, chat: Chat) => void;
  copyToClipboard: (text: string) => void;
  insertCodeBlock: (code: string) => void;
  diffCodeBlock: (code: string) => void;
  updatePersona: (persona: Persona | PersonaDraft) => void;
  deletePersona: (personaId: number) => void;
  manageApiKeys: (modelProvider: ModelProvider | undefined) => void;
  setDefaultPersonaId: (personaId: number) => void;
  openExtensionVsCodeSettings: () => void;
  importPersona: () => void;
  exportPersona: (personaId: number) => void;
};

// Default context value should never be used, but is required to be defined
const ExtensionMessageContext = createContext<ExtensionMessageContextType>({
  createNewChat: () => {},
  updateChat: () => {},
  deleteChat: () => {},
  addCodeToChat: () => {},
  sendChatMessage: () => {},
  copyToClipboard: () => {},
  insertCodeBlock: () => {},
  diffCodeBlock: () => {},
  updatePersona: () => {},
  deletePersona: () => {},
  manageApiKeys: () => {},
  setDefaultPersonaId: () => {},
  openExtensionVsCodeSettings: () => {},
  importPersona: () => {},
  exportPersona: () => {},
});

export const ExtensionMessageContextProvider = ({
  webviewToExtensionMessageSender,
  children,
}: {
  webviewToExtensionMessageSender: WebviewToExtensionMessageSender;
  children: React.ReactNode;
}) => {
  const context: ExtensionMessageContextType = {
    createNewChat: webviewToExtensionMessageSender.newChat,
    updateChat: webviewToExtensionMessageSender.updateChat,
    deleteChat: webviewToExtensionMessageSender.deleteChat,
    addCodeToChat: webviewToExtensionMessageSender.addCodeToChat,
    sendChatMessage: webviewToExtensionMessageSender.sendChatMessage,
    copyToClipboard: webviewToExtensionMessageSender.copyToClipboard,
    insertCodeBlock: webviewToExtensionMessageSender.insertCodeBlock,
    diffCodeBlock: webviewToExtensionMessageSender.diffCodeBlock,
    updatePersona: webviewToExtensionMessageSender.updatePersona,
    deletePersona: webviewToExtensionMessageSender.deletePersona,
    manageApiKeys: webviewToExtensionMessageSender.manageApiKeys,
    setDefaultPersonaId: webviewToExtensionMessageSender.setDefaultPersonaId,
    openExtensionVsCodeSettings:
      webviewToExtensionMessageSender.openExtensionVsCodeSettings,
    importPersona: webviewToExtensionMessageSender.importPersona,
    exportPersona: webviewToExtensionMessageSender.exportPersona,
  };
  return (
    <ExtensionMessageContext.Provider value={context}>
      {children}
    </ExtensionMessageContext.Provider>
  );
};

/**
 * Hook to use the extension message context.
 */
export function useExtensionMessageContext() {
  const context = useContext(ExtensionMessageContext);
  if (!context) {
    throw new Error(
      "useExtensionMessageContext must be used within an ExtensionMessageContextProvider",
    );
  }
  return context;
}
