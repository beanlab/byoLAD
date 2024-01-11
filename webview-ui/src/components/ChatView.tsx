import { useState } from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ChatRole, Chat, TextBlock } from "../utilities/ChatModel";
import { VSCodeButton, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { VSCodeBadge } from "@vscode/webview-ui-toolkit/react";
import { Message } from "./Message";
import { ImagePaths } from "../types";
import ErrorMessage from "./ErrorMessage";
import autosize from "autosize";

interface ChatViewProps {
  activeChat: Chat;
  changeActiveChat: (chat: Chat | null) => void;
  imagePaths: ImagePaths;
  loadingMessage: boolean;
  setLoadingMessage: (loading: boolean) => void;
  errorMessage: string | null;
}

/**
 * A single chat used to communicate with the AI. Includes chat messages and an
 * input text box to send messages.
 */
export const ChatView = ({
  activeChat,
  changeActiveChat,
  imagePaths,
  loadingMessage,
  setLoadingMessage,
  errorMessage,
}: ChatViewProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const extensionMessenger = new ExtensionMessenger();
  let innerTextArea: HTMLTextAreaElement | null | undefined = null;

  const handleInputOnChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setUserPrompt(event.target.value);
    if (innerTextArea) {
      autosize.update(innerTextArea);
    } else {
      innerTextArea = document
        .getElementById("vscode-textarea-chat-input")
        ?.shadowRoot?.querySelector("textarea");
      if (innerTextArea) {
        innerTextArea.style.paddingRight = "35px"; // Can't use in main CSS file because of shadow DOM
        autosize(innerTextArea);
      }
      // TODO: How to handle else?
    }
  };

  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setLoadingMessage(true);
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

  const deleteMessageBlock = (
    messagePosition: number,
    messageBlockPosition: number,
  ) => {
    const newChat = { ...activeChat };
    newChat.messages[messagePosition].content.splice(messageBlockPosition, 1);
    if (newChat.messages[messagePosition].content.length == 0) {
      if (
        newChat.messages.length > messagePosition + 1 &&
        messagePosition != 0 &&
        newChat.messages[messagePosition - 1].role ===
          newChat.messages[messagePosition + 1].role
      ) {
        newChat.messages[messagePosition + 1].content.forEach((currMessage) => {
          newChat.messages[messagePosition - 1].content.push(currMessage);
        });
        newChat.messages.splice(messagePosition + 1, 1);
      }
      newChat.messages.splice(messagePosition, 1);
    }
    extensionMessenger.updateChat(newChat);
  };

  const messages = activeChat.messages.map((message, position) => {
    if (message.role != ChatRole.System) {
      return (
        <Message
          role={message.role}
          messageBlocks={message.content}
          extensionMessenger={extensionMessenger}
          deleteMessageBlock={(messageBlockPosition: number) =>
            deleteMessageBlock(position, messageBlockPosition)
          }
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
          code. You can add snippets of code to your chat from the editor by
          selecting the code and clicking the "Add Code to Chat" button.
        </p>
      </div>
    );
  }

  return (
    <div>
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
            aria-label="New chat"
            title="New chat"
            onClick={extensionMessenger.newChat}
          >
            <i className="codicon codicon-add"></i>
          </VSCodeButton>
        </VSCodeBadge>
      </div>
      <div className="message-list">
        <div>{welcomeMessage}</div>
        <div>{messages}</div>
        {loadingMessage === true && <p>Loading...</p>}
        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
      </div>

      <form
        className="chat-form"
        name="chatbox"
        onSubmit={(e) => handleSubmit(e)}
      >
        <VSCodeTextArea
          id="vscode-textarea-chat-input"
          className="chat-input"
          onInputCapture={handleInputOnChange}
          placeholder="Your message..."
          rows={1}
          value={userPrompt}
        />
        <VSCodeButton
          type="submit"
          className="send-button"
          appearance="icon"
          aria-label="Send message"
          title="Send message"
        >
          <i className="codicon codicon-send"></i>
        </VSCodeButton>
      </form>
    </div>
  );
};
