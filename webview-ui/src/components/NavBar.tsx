import { VSCodeBadge, VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import React from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { Chat } from "../utilities/ChatModel";

interface NavBarProps {
  showBackButton?: boolean;
  changeActiveChat: (chat: Chat | null) => void;
}

const NavBar: React.FC<NavBarProps> = ({
  showBackButton,
  changeActiveChat,
}) => {
  const extensionMessenger = new ExtensionMessenger();

  return (
    <div>
      <VSCodeBadge className="navbar">
        {showBackButton && (
          <VSCodeButton
            appearance="icon"
            aria-label="Back to chat list"
            title="Back to chat list"
            onClick={() => changeActiveChat(null)}
            className="back-button"
          >
            <i className="codicon codicon-chevron-left"></i>
          </VSCodeButton>
        )}
        <VSCodeButton
          appearance="icon"
          aria-label="New chat"
          title="New chat"
          onClick={extensionMessenger.newChat}
        >
          <i className="codicon codicon-add"></i>
        </VSCodeButton>
      </VSCodeBadge>
    </div>
  );
};

export default NavBar;
