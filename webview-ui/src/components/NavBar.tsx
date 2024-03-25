import React from "react";

import { VSCodeBadge, VSCodeButton } from "@vscode/webview-ui-toolkit/react";

import { AppView } from "../types";
import { useAppContext } from "../utilities/AppContext";
import { useExtensionMessageContext } from "../utilities/ExtensionMessageContext";
import { PersonaDropdown } from "./PersonaDropdown";

export const NavBar: React.FC = () => {
  const { navigate, appView, activeChat, personaList } = useAppContext();
  const {
    createNewChat,
    updateChat,
    manageApiKeys,
    openExtensionVsCodeSettings,
  } = useExtensionMessageContext();

  const hasBackButton = () =>
    appView === AppView.Chat || appView === AppView.Settings;
  const hasNewChatButton = () =>
    appView === AppView.Chat || appView === AppView.ChatList;
  const hasPersonaDropdown = () => appView === AppView.Chat;
  const hasSettingsButton = () => appView !== AppView.Settings;
  const hasApiKeysButton = () => appView == AppView.Settings;
  const hasAdditionalSettingsButton = () => appView === AppView.Settings;

  const handleBackButtonClick = () => {
    if (appView === AppView.Chat) {
      navigate(AppView.ChatList);
    } else if (appView === AppView.Settings) {
      if (activeChat) {
        navigate(AppView.Chat, activeChat);
      } else {
        navigate(AppView.ChatList);
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
            onClick={() => navigate(AppView.Settings)}
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
        {hasAdditionalSettingsButton() && (
          <VSCodeButton
            appearance="icon"
            aria-label="Additional settings"
            title="Additional settings"
            onClick={openExtensionVsCodeSettings}
          >
            <i className="codicon codicon-settings-gear"></i>
          </VSCodeButton>
        )}
      </div>
    </div>
  );
};

export default NavBar;
