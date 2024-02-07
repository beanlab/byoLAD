import { Chat } from "../../utilities/ChatModel";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";


interface ChatInChatListProps {
    chat: Chat;
    handleClick: (chat: Chat) => void;
    handleDeleteClick: (chat: Chat) => void;
    handleTitleChange: (chat:Chat, newTitle: string) => void;
    id: number;
}

export const ChatInChatList = ({chat, handleClick, handleDeleteClick, handleTitleChange, id}: ChatInChatListProps) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState(chat.title);

    const handleEditClick = () => {
        console.log("handling edit click")
        setEditing(!editing);
        if (editing === true) {
          handleTitleChange(chat, value)
        }
    };

    const handleInputChange = (event: React.FormEvent<HTMLElement>) => {      
        setValue((event.target as HTMLInputElement).value);
    };

    return (
        <div className="convo" key={id}>
            
            {editing ? (
                <input value={value} onChange={handleInputChange} />
            ) : (
                <div
                    onClick={() => handleClick(chat)}
                    className="convo-id"
                >
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
            onClick={() => handleDeleteClick(chat)}
          >
            <i className="codicon codicon-trash"></i>
          </VSCodeButton>

        </div>
      </div>
    );

}