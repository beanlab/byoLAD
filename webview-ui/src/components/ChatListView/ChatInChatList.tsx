import { Chat } from "../../../../shared/types";
import { VSCodeButton, VSCodeTag } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import { useExtensionMessageContext } from "../../utilities/ExtensionMessageContext";

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

  const handleInputChange = (event: React.FormEvent<HTMLElement>) => {
    setTitle((event.target as HTMLInputElement).value);
  };

  return (
    <div>
      <div className="convo" key={id}>
        {editing ? (
          <input value={title} onChange={handleInputChange} />
        ) : (
          <div onClick={() => handleClick(chat)} className="convo-id">
            {chat.title}
          </div>
        )}
        <div>
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
            {chat.tags.map((tagName,i)=>(
              <div className="file-tag">
                <VSCodeTag  key={i}>{tagName}</VSCodeTag>
              </div>
            ))}
        </div>
        <div className='persona-tag'>
          <VSCodeTag>Persona name</VSCodeTag>
        </div>
      </div>
    </div>
  );
};
