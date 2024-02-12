import React from "react";
import { VSCodeBadge, VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { Chat } from "../../../shared/types";

interface NavBarProps {
  showBackButton?: boolean;
  changeActiveChat: (chat: Chat | null) => void;
  createNewChat: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  showBackButton,
  changeActiveChat,
  createNewChat,
}) => {
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
          onClick={() => createNewChat()}
        >
          <i className="codicon codicon-add"></i>
        </VSCodeButton>
      </VSCodeBadge>
    </div>
  );
};

export default NavBar;
