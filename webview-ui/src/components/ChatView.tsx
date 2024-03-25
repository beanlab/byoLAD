import { useEffect, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";

import { Chat, ChatRole, ImagePaths } from "../../../shared/types";
import { AppView } from "../types";
import { useAppContext } from "../utilities/AppContext";
import { useExtensionMessageContext } from "../utilities/ExtensionMessageContext";
import { ChatInput } from "./ChatInput";
import ErrorMessage from "./ErrorMessage";
import { Message } from "./Message";
import NavBar from "./NavBar";

interface ChatViewProps {
  imagePaths: ImagePaths;
  errorMessage: string | null;
  hasSelection: boolean;
  loadingMessageState: {
    loadingMessage: boolean;
    setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

/**
 * A single chat used to communicate with the AI. Includes chat messages and an
 * input text box to send messages.
 */
export const ChatView = ({
  imagePaths,
  errorMessage,
  hasSelection,
  loadingMessageState,
}: ChatViewProps) => {
  const { activeChat, navigate } = useAppContext();
  const { updateChat } = useExtensionMessageContext();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  if (!activeChat) {
    navigate(AppView.ChatList);
  }

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

  const deleteMessageBlock = (
    messagePosition: number,
    messageBlockPosition: number,
    chat: Chat,
  ) => {
    const newChat = { ...chat };
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
    updateChat(newChat);
  };

  const messages = activeChat
    ? activeChat.messages.map((message, position) => {
        if (message.role != ChatRole.System) {
          return (
            <Message
              role={message.role}
              messageBlocks={message.content}
              deleteMessageBlock={(messageBlockPosition: number) =>
                deleteMessageBlock(position, messageBlockPosition, activeChat)
              }
            />
          );
        }
      })
    : [];

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
  }, [activeChat?.messages]);

  let welcomeMessage = null;
  if (activeChat && activeChat.messages.length === 0) {
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
    <>
      {activeChat ? (
        <div className="view-container">
          <NavBar />
          <div className="page-header">
            <h2>{activeChat.title}</h2>
          </div>
          <div className="message-list">
            <div>{welcomeMessage}</div>
            <div>{messages}</div>
            <div ref={endOfMessagesRef}></div>
          </div>

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <ChatInput
            activeChat={activeChat}
            hasSelection={hasSelection}
            loadingMessageState={loadingMessageState}
          />
        </div>
      ) : (
        <div>No active chat found. Try reloading this window.</div>
      )}
    </>
  );
};
