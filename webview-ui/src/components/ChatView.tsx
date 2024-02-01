import { useState, useRef, useEffect } from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ChatRole, Chat, TextBlock } from "../utilities/ChatModel";
import {
  VSCodeButton,
  VSCodeProgressRing,
  VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { Message } from "./Message";
import { ImagePaths } from "../types";
import ErrorMessage from "./ErrorMessage";
import autosize from "autosize";
import NavBar from "./NavBar";
import scrollIntoView from "scroll-into-view-if-needed";

interface ChatViewProps {
  activeChat: Chat;
  changeActiveChat: (chat: Chat | null) => void;
  imagePaths: ImagePaths;
  loadingMessage: boolean;
  setLoadingMessage: (loading: boolean) => void;
  errorMessage: string | null;
  hasSelection: boolean;
}

/**
 * Replaces all instances of "\n" with "  \n" for proper Markdown rendering.
 * @param text Text that represents newlines with "\n".
 */
function convertNewlines(text: string): string {
  return text.replace(/\n/g, "  \n");
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
  hasSelection,
}: ChatViewProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const extensionMessenger = new ExtensionMessenger();
  let innerTextArea: HTMLTextAreaElement | null | undefined = null;
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll to the bottom of the chat (if messages are long enough to scroll).
   */
  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      scrollIntoView(endOfMessagesRef.current, {
        behavior: "smooth",
        scrollMode: "if-needed",
      });
    }
  };

  /**
   * Only handle sending the message if not Shift+Enter key combination.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSubmit();
    }
  };

  /**
   * Update user prompt and resize text area if necessary and possible.
   */
  const onInput = (event: InputEvent) => {
    const target = event.target as HTMLTextAreaElement;
    setUserPrompt(target.value);

    if (innerTextArea) {
      autosize.update(innerTextArea);
    } else {
      innerTextArea = target.shadowRoot?.querySelector("textarea");
      if (innerTextArea) {
        // Can't style in main CSS file because it's in the shadow DOM which is inaccessible
        innerTextArea.style.paddingRight = "50px";
        innerTextArea.style.maxHeight = "50vh"; // maxHeight as recommended in the `autosize` package docs (http://www.jacklmoore.com/autosize/)
        autosize(innerTextArea);
      } else {
        // innerTextArea should be the <textarea> in the shadow DOM of the <VSCodeTextArea> component used as the chat input.
        // Will only be null at this point if the Webview UI Toolkit changes their implementation of <VSCodeTextArea> to not even use a <textarea>.
        console.error(
          "innerTextArea (<textarea> within shadow DOM of <VSCodeTextArea>) is null: could not resize the <textarea>",
        );
      }
    }
  };

  const handleSubmit = () => {
    if (userPrompt.trim() === "") {
      return;
    }
    setLoadingMessage(true);

    const userInput = convertNewlines(userPrompt);

    const newActiveChat = { ...activeChat };
    if (!newActiveChat.messages || newActiveChat.messages.length === 0) {
      newActiveChat.messages = [];
      const newUserMessage = {
        content: [
          {
            type: "text",
            content: userInput,
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
          content: userInput,
        } as TextBlock);
      } else {
        const newUserMessage = {
          content: [
            {
              type: "text",
              content: userInput,
            } as TextBlock,
          ],
          role: ChatRole.User,
        };
        newActiveChat.messages.push(newUserMessage);
      }
    }
    changeActiveChat(newActiveChat);
    extensionMessenger.sendChatMessage(
      newActiveChat.messages[newActiveChat.messages.length - 1],
      true,
    );
    setUserPrompt("");
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
  // Refs to persist across renders
  const prevMessagesLengthRef = useRef(messages.length);
  const prevBlocksInLastMessageRef = useRef(0);

  /**
   * Automatically scroll to the bottom of the chat only when new messages/blocks are added.
   * This is done by comparing the current length of messages/blocks to the previous length of messages/blocks.
   */
  useEffect(() => {
    if (activeChat && activeChat.messages && activeChat.messages.length > 0) {
      const lastMessage = activeChat.messages[activeChat.messages.length - 1];
      if (activeChat.messages.length > prevMessagesLengthRef.current) {
        // When new messages are added
        scrollToBottom();
      } else if (activeChat.messages.length === prevMessagesLengthRef.current) {
        console.log("lastMessage", lastMessage);
        if (
          lastMessage &&
          lastMessage.content.length > prevBlocksInLastMessageRef.current
        ) {
          // Or when new message blocks are added
          scrollToBottom();
        }
      }
      prevMessagesLengthRef.current = activeChat.messages.length; // Update count for next render
      prevBlocksInLastMessageRef.current = lastMessage.content.length; // Update count for next render
    }
  }, [activeChat.messages]);

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
    <div className="view-container">
      <NavBar showBackButton={true} changeActiveChat={changeActiveChat} />
      <div className="message-list">
        <div>{welcomeMessage}</div>
        <div>{messages}</div>
        <div ref={endOfMessagesRef}></div>
      </div>

      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

      <div className="chat-box">
        {loadingMessage ? (
          <div className="loading-indicator">
            <VSCodeProgressRing></VSCodeProgressRing>
          </div>
        ) : (
          <form className="chat-form">
            <VSCodeTextArea
              id="vscode-textarea-chat-input"
              className="chat-input"
              onInput={(e) => onInput(e as InputEvent)}
              onKeyDown={onKeyDown}
              placeholder="Your message..."
              rows={1}
              value={userPrompt}
            />
            <div className="chat-input-buttons">
              {hasSelection ? (
                <VSCodeButton
                  title="Add selected code to chat"
                  aria-label="Add selected code to chat"
                  appearance="icon"
                  onClick={extensionMessenger.addCodeToChat}
                >
                  <i className="codicon codicon-code"></i>
                </VSCodeButton>
              ) : (
                <VSCodeButton
                  title="Add current file to chat"
                  aria-label="Add current file to chat"
                  appearance="icon"
                  onClick={extensionMessenger.addCodeToChat}
                >
                  <i className="codicon codicon-file-code"></i>
                </VSCodeButton>
              )}
              <VSCodeButton
                title="Send message"
                aria-label="Send message"
                appearance="icon"
                onClick={handleSubmit}
                disabled={userPrompt.trim() === ""}
              >
                <i className="codicon codicon-send"></i>
              </VSCodeButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
