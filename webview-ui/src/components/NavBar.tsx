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
    setActiveViewAsSettings,
  } = useAppContext();
  const { createNewChat, updateChat, manageApiKeys } =
    useExtensionMessageContext();

  const hasBackButton = () =>
    activeView === ActiveView.Chat || activeView === ActiveView.Settings;

  const hasNewChatButton = () =>
    activeView === ActiveView.ChatList || activeView === ActiveView.Chat;

  const hasPersonaDropdown = () => activeView === ActiveView.Chat;

  const hasSettingsButton = () =>
    activeView == ActiveView.Chat || activeView === ActiveView.ChatList;

  const hasApiKeysButton = () => activeView == ActiveView.Settings;

  const handleBackButtonClick = () => {
    if (activeView === ActiveView.Chat) {
      setActiveViewAsChatList();
    } else if (activeView === ActiveView.Settings) {
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
      <div className="horizontal-section">
        <VSCodeBadge>
          {hasBackButton() && (
            <VSCodeButton
              appearance="icon"
              aria-label="Back"
              title="Back"
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
      <div className="horizontal-section">
        {hasPersonaDropdown() && activeChat && (
          <PersonaDropdown
            personas={personaList}
            selectedPersonaId={activeChat.personaId}
            changeSelectedPersonaId={(id) => {
              activeChat.personaId = id;
              updateChat(activeChat);
            }}
          />
        )}
        {hasSettingsButton() && (
          <VSCodeButton
            appearance="icon"
            aria-label="Settings"
            title="Settings"
            onClick={setActiveViewAsSettings}
          >
            <i className="codicon codicon-settings"></i>
          </VSCodeButton>
        )}
        {hasApiKeysButton() && (
          <VSCodeButton
            onClick={() => manageApiKeys(undefined)}
            appearance="icon"
            title="Manage API Keys"
            aria-label="Manage API Keys"
          >
            <i className="codicon codicon-key"></i>
          </VSCodeButton>
        )}
      </div>
    </div>
  );
};

export default NavBar;
