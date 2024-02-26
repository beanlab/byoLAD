import { Chat } from "../../../../shared/types";
import {
  VSCodeButton,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";
import React from "react";

interface ChatInChatListProps {
  chat: Chat;
  handleClick: (chat: Chat) => void;
  id: number;
}

export const ChatInChatList = ({
  chat,
  handleClick,
  id,
}: ChatInChatListProps) => {
  const { deleteChat, updateChat } = useExtensionMessageContext();
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(chat.title);

  const handleEditClick = () => {
    setEditing(!editing);
    if (editing === true) {
      chat.title = title;
      updateChat(chat);
    }
  };

  const handleInputChange = (event: InputEvent) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  return (
    <div className="convo" key={id}>
      {editing ? (
        <VSCodeTextField
          value={title}
          onInput={(e) => handleInputChange(e as InputEvent)}
          autofocus
        />
      ) : (
        <div onClick={() => handleClick(chat)} className="convo-id">
          {chat.title}
        </div>
      )}
      <div className="convo-action-buttons">
        {editing ? (
          <VSCodeButton
            appearance="icon"
            aria-label="Done editing chat title"
            title="Done editing chat title"
            onClick={() => handleEditClick()}
          >
            <i className="codicon codicon-check"></i>
          </VSCodeButton>
        ) : (
          <VSCodeButton
            appearance="icon"
            aria-label="Edit chat title"
            title="Edit chat title"
            onClick={() => handleEditClick()}
          >
            <i className="codicon codicon-edit"></i>
          </VSCodeButton>
        )}
        <VSCodeButton
          appearance="icon"
          aria-label="Delete chat"
          title="Delete chat"
          onClick={() => deleteChat(chat.id)}
        >
          <i className="codicon codicon-trash"></i>
        </VSCodeButton>
      </div>
    </div>
  );
};
