import React from "react";

import { Chat, Persona } from "../../../shared/types";
import { AppView } from "../types";

interface AppContext {
  appView: AppView;
  /**
   * Navigate to a new view. If chat is provided, it will be set as the active chat,
   * only if the new view is Chat.
   * @param appView View to navigate to.
   * @param chat Chat to set as active chat. Ignored if appView is not Chat.
   */
  navigate: (appView: AppView, chat?: Chat) => void;
  chatList: Chat[];
  setChatList: (chats: Chat[]) => void;
  activeChat: Chat | null | undefined;
  setActiveChat: (chat: Chat | null) => void;
  personaList: Persona[];
  setPersonaList: (personas: Persona[]) => void;
  defaultPersonaId: number;
}

export const AppContext = React.createContext<AppContext | undefined>(
  undefined,
);

/**
 * Hook to use the app context.
 */
export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error(
      "useAppContext must be used within an useAppContext.Provider",
    );
  }
  return context;
}
