
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";

interface Props {
    onClick: () => void;
}

export const ChatListHeader = ({onClick}: Props) => {
    return (
      <VSCodeBadge className="navbar">
        <VSCodeButton
          appearance="icon"
          aria-label="New conversation"
          title="New conversation"
          onClick={() => onClick()}
        >
          <i className="codicon codicon-add"></i>
        </VSCodeButton>
      </VSCodeBadge>
    )
}