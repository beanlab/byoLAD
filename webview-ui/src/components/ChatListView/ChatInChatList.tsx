import { useState } from "react";

import {
  VSCodeButton,
  VSCodeTag,
  VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";

import { Chat } from "../../../../shared/types";
import { AppView } from "../../types";
import { useAppContext } from "../../utilities/AppContext";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";

interface ChatInChatListProps {
  chat: Chat;
}

export const ChatInChatList = ({ chat }: ChatInChatListProps) => {
  const { deleteChat, updateChat } = useExtensionMessageContext();
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(chat.title);
  const { navigate, personaList } = useAppContext();

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

  const getPersonaName = (personaId: number) =>
    personaList.find((p) => p.id === personaId)?.name;

  return (
    <div>
      <div className="convo">
        {editing ? (
          <VSCodeTextField
            value={title}
            onInput={(e) => handleInputChange(e as InputEvent)}
          />
        ) : (
          <div
            onClick={() => navigate(AppView.Chat, chat)}
            className="convo-id chat-title"
            title={chat.title}
          >
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

      <div className="tags">
        <div className="file-tags">
          {chat.tags.map((tagName, i) => (
            <div className="file-tag">
              <VSCodeTag key={i}>{tagName}</VSCodeTag>
            </div>
          ))}
        </div>
        <div className="persona-tag">
          <VSCodeTag>{getPersonaName(chat.personaId)}</VSCodeTag>
        </div>
      </div>
    </div>
  );
};
