import React from "react";
import { VSCodeBadge, VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useExtensionMessageContext } from "../utilities/ExtensionMessageContext";
import { PersonaDropdown } from "./PersonaDropdown";
import { ActiveView } from "../types";
import { useAppContext } from "../utilities/AppContext";

export const NavBar: React.FC = () => {
  const {
    activeView,
    activeChat,
    personaList,
    setActiveViewAsChat,
    setActiveViewAsChatList,
    setActiveViewAsPersonaSettings,
  } = useAppContext();
  const { createNewChat, updateChat } = useExtensionMessageContext();

  const hasBackButton = () => {
    return (
      activeView === ActiveView.Chat ||
      activeView === ActiveView.PersonaSettings
    );
  };

  const hasNewChatButton = () => {
    return activeView === ActiveView.ChatList || activeView === ActiveView.Chat;
  };

  const hasPersonaDropdown = () => {
    return activeView === ActiveView.Chat;
  };

  const hasSettingsButton = () => {
    return activeView == ActiveView.Chat || activeView === ActiveView.ChatList;
  };

  const handleBackButtonClick = () => {
    if (activeView === ActiveView.Chat) {
      setActiveViewAsChatList();
    } else if (activeView === ActiveView.PersonaSettings) {
      if (activeChat) {
        setActiveViewAsChat(activeChat);
      } else {
        setActiveViewAsChatList();
      }
    }
  };

  return (
    <div className="navbar">
      {/* Left section of navbar */}
      <div className="navbar-section">
        <VSCodeBadge>
          {hasBackButton() && (
            <VSCodeButton
              appearance="icon"
              aria-label="Back to chat list"
              title="Back to chat list"
              onClick={handleBackButtonClick}
            >
              <i className="codicon codicon-chevron-left"></i>
            </VSCodeButton>
          )}
          {hasNewChatButton() && (
            <VSCodeButton
              appearance="icon"
              aria-label="New chat"
              title="New chat"
              onClick={createNewChat}
            >
              <i className="codicon codicon-add"></i>
            </VSCodeButton>
          )}
        </VSCodeBadge>
      </div>

      {/* Right section of navbar */}
      <div className="navbar-section">
        {hasPersonaDropdown() && activeChat && (
          <PersonaDropdown
            personas={personaList}
            selectedPersonaId={activeChat.personaId}
            changeSelectedPersonaId={(id) => {
              activeChat.id = id;
              updateChat(activeChat);
            }}
          />
        )}
        {hasSettingsButton() && (
          <VSCodeButton
            appearance="icon"
            aria-label="Settings"
            title="Persona Settings"
            onClick={setActiveViewAsPersonaSettings}
          >
            <i className="codicon codicon-settings"></i>
          </VSCodeButton>
        )}
      </div>
    </div>
  );
};

export default NavBar;
