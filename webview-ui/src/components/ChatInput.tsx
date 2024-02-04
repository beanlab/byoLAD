import React, { useState } from "react";
import {
  VSCodeButton,
  VSCodeProgressRing,
  VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { Chat, ChatRole, TextBlock } from "../utilities/ChatModel";
import autosize from "autosize";

interface ChatInputProps {
  activeChat: Chat;
  changeActiveChat: (chat: Chat | null) => void;
  loadingMessage: boolean;
  setLoadingMessage: (loading: boolean) => void;
  hasSelection: boolean;
}

export const ChatInput = ({
  activeChat,
  changeActiveChat,
  loadingMessage,
  setLoadingMessage,
  hasSelection,
}: ChatInputProps) => {
  const [userPrompt, setUserPrompt] = useState("");
  const extensionMessenger = new ExtensionMessenger();
  let innerTextArea: HTMLTextAreaElement | null | undefined = null;

  /**
   * Replaces all instances of "\n" with "  \n" for proper Markdown rendering.
   * @param text Text that represents newlines with "\n".
   */
  const convertNewlines = (text: string): string => {
    return text.replace(/\n/g, "  \n");
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

  return (
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
  );
};
