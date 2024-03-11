import React from "react";
import { ActiveView } from "../types";
import { Chat, Persona } from "../../../shared/types";

interface AppContext {
  activeView: ActiveView;
  setActiveViewAsChatList: () => void;
  setActiveViewAsChat: (chat: Chat) => void;
  setActiveViewAsSettings: () => void;
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
 * Hook to use the active view context.
 */
export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error(
      "useActiveViewContext must be used within an ActiveViewContext.Provider",
    );
  }
  return context;
}
