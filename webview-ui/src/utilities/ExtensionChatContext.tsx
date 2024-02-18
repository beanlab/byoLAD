import { createContext, useContext } from "react";
import { ExtensionMessageSender } from "./ExtensionMessageSender";
import { Chat } from "../../../shared/types";

type ExtensionMessageContextType = {
  createNewChat: () => void;
  updateChat: (chat: Chat) => void;
  deleteChat: (chatId: number) => void;
  addCodeToChat: () => void;
  sendChatMessage: (message: string, chat: Chat) => void;
  copyToClipboard: (text: string) => void;
  insertCodeBlock: (code: string) => void;
  diffCodeBlock: (code: string) => void;
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
});

export const ExtensionMessageContextProvider = ({
  extensionMessageSender,
  children,
}: {
  extensionMessageSender: ExtensionMessageSender;
  children: React.ReactNode;
}) => {
  const context: ExtensionMessageContextType = {
    createNewChat: extensionMessageSender.newChat,
    updateChat: extensionMessageSender.updateChat,
    deleteChat: extensionMessageSender.deleteChat,
    addCodeToChat: extensionMessageSender.addCodeToChat,
    sendChatMessage: extensionMessageSender.sendChatMessage,
    copyToClipboard: extensionMessageSender.copyToClipboard,
    insertCodeBlock: extensionMessageSender.insertCodeBlock,
    diffCodeBlock: extensionMessageSender.diffCodeBlock,
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
      "useExtensionMessageContext must be used within a ExtensionMessageContextProvider",
    );
  }
  return context;
}
