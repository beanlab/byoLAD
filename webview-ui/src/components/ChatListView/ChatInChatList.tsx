import { Conversation } from "../../utilities/ChatModel";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";


interface ChatInChatListProps {
    conversation: Conversation;
    handleClick: (conversation: Conversation) => void;
    handleDeleteClick: (conversation: Conversation) => void;
    handleTitleChange: (conversation:Conversation, newTitle: string) => void;
    id: number;
}

export const ChatInChatList = ({conversation, handleClick, handleDeleteClick, handleTitleChange, id}: ChatInChatListProps) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [value, setValue] = useState(conversation.title);

    const handleEditClick = () => {
        setEditing(!editing);
        if (editing === true) {
          handleTitleChange(conversation, value)
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
                    onClick={() => handleClick(conversation)}
                    className="convo-id"
                >
                    {conversation.title}
                </div>
            )} 
        <div>

        {editing ? (
          <VSCodeButton
            appearance="icon"
            aria-label="Done editing conversation title"
            title="Done editing conversation title"
            onClick={() => handleEditClick()}
            >
            <i className="codicon codicon-check"></i>
          </VSCodeButton>
        ) : (
          <VSCodeButton
            appearance="icon"
            aria-label="Edit conversation title"
            title="Edit conversation title"
            onClick={() => handleEditClick()}
            >
            <i className="codicon codicon-edit"></i>
          </VSCodeButton>
        )}
          <VSCodeButton
            appearance="icon"
            aria-label="Delete conversation"
            title="Delete conversation"
            onClick={() => handleDeleteClick(conversation)}
          >
            <i className="codicon codicon-trash"></i>
          </VSCodeButton>

        </div>
      </div>
    );

}