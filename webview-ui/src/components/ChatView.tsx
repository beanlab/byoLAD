import { useState } from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ChatRole, Conversation, TextBlock } from "../utilities/ChatModel";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";
import { Message } from "./Message";
import { ImagePaths } from "../types";

interface ChatViewProps {
  activeChat: Conversation;
  changeActiveChat: (conversation: Conversation | null) => void;
  imagePaths: ImagePaths;
}

export const ChatView = ({
  activeChat,
  changeActiveChat,
  imagePaths,
}: ChatViewProps) => {
  const [userPrompt, setUserPrompt] = useState("");

  const extensionMessenger = new ExtensionMessenger();

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newval = event.target.value;
    setUserPrompt(newval);
  };

  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const newActiveChat = { ...activeChat };
    if (!newActiveChat.messages || newActiveChat.messages.length === 0) {
      newActiveChat.messages = [];
      const newUserMessage = {
        content: [
          {
            type: "text",
            content: userPrompt,
          } as TextBlock,
        ],
        role: ChatRole.User,
      };
      newActiveChat.messages.push(newUserMessage);
    } else {
      const lastMessage =
        newActiveChat.messages[newActiveChat.messages.length - 1];
      if (lastMessage.role === ChatRole.User) {
        lastMessage.content.push({
          type: "text",
          content: userPrompt,
        } as TextBlock);
      } else {
        const newUserMessage = {
          content: [
            {
              type: "text",
              content: userPrompt,
            } as TextBlock,
          ],
          role: ChatRole.User,
        };
        newActiveChat.messages.push(newUserMessage);
      }
    }
    changeActiveChat(newActiveChat);
    setUserPrompt("");
    extensionMessenger.sendChatMessage(
      newActiveChat.messages[newActiveChat.messages.length - 1],
      true,
    );
  };

  const messages = activeChat.messages.map((message, position) => {
    console.log(position);
    if (message.role != ChatRole.System) {
      return (
        <Message
          role={message.role}
          messageBlocks={message.content}
          extensionMessenger={extensionMessenger}
        />
      );
    }
  });

  let welcomeMessage = null;
  if (activeChat.messages.length === 0) {
    welcomeMessage = (
      <div className="welcome-message">
        <div className="top-logo">
          <img src={imagePaths.byoLadCircleImageUri} className="App-logo" />
          <p className="top-font">byoLAD</p>
        </div>
        <p>
          Here you can chat with your AI, ask questions about code, or generate
          code. You can add snippets of code to your conversation from the
          editor by selecting the code and clicking the "Add to chat" button.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <VSCodeBadge className="navbar">
          <VSCodeButton
            appearance="icon"
            aria-label="Back to chat list"
            title="Back to chat list"
            onClick={() => changeActiveChat(null)}
            className="back-button"
          >
            <i className="codicon codicon-chevron-left"></i>
          </VSCodeButton>
          <VSCodeButton
            appearance="icon"
            aria-label="New conversation"
            title="New conversation"
            onClick={extensionMessenger.newConversation}
          >
            <i className="codicon codicon-add"></i>
          </VSCodeButton>
        </VSCodeBadge>
      </div>
      <div className="App-body">
        <div>{welcomeMessage}</div>
        <div>{messages}</div>
      </div>
      <footer className="App-footer">
        <div className="chat-box">
          <form
            className="chat-bar"
            name="chatbox"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              onChange={handleInputOnChange}
              value={userPrompt}
              type="text"
              placeholder="Message"
            />
            <VSCodeButton
              type="submit"
              appearance="icon"
              aria-label="Send message"
              title="Send message"
            >
              <i className="codicon codicon-send"></i>
            </VSCodeButton>
          </form>
        </div>
        <div className="chat-prompts">
          <div className="prompt-button">
            <VSCodeButton onClick={extensionMessenger.reviewCode}>
              Review Code
            </VSCodeButton>
          </div>
          <div className="prompt-button">
            <VSCodeButton onClick={extensionMessenger.explainCode}>
              Explain Code
            </VSCodeButton>
          </div>
        </div>
      </footer>
    </div>
  );
};
