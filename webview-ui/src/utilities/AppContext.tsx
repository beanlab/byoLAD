import React from "react";
import { ActiveView } from "../types";
import { Chat, Persona } from "../../../shared/types";

interface AppContext {
  activeView: ActiveView;
  /**
   * Navigate to a new view. If chat is provided, it will be set as the active chat,
   * only if the active view is Chat.
   * @param activeView Active view to navigate to.
   * @param chat Chat to set as active chat. Ignored if activeView is not Chat.
   */
  navigate: (activeView: ActiveView, chat?: Chat) => void;
  chatList: Chat[];
  setChatList: (chats: Chat[]) => void;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  personaList: Persona[];
  setPersonaList: (personas: Persona[]) => void;
  defaultPersonaId: number;
  setDefaultPersonaId: (id: number) => void;
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
