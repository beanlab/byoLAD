import React, { useState } from "react";
import {
  VSCodeButton,
  VSCodeProgressRing,
  VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { Chat } from "../../../shared/types";
import autosize from "autosize";
import { useExtensionMessageContext } from "../utilities/ExtensionChatContext";

interface ChatInputProps {
  activeChat: Chat;
  hasSelection: boolean;
  loadingMessageState: {
    loadingMessage: boolean;
    setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

export const ChatInput = ({
  activeChat,
  hasSelection,
  loadingMessageState,
}: ChatInputProps) => {
  const [userInput, setUserInput] = useState("");
  const { sendChatMessage, addCodeToChat } = useExtensionMessageContext();
  let innerTextArea: HTMLTextAreaElement | null | undefined = null;

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
    setUserInput(target.value);

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
    if (userInput.trim() === "") {
      return;
    }
    loadingMessageState.setLoadingMessage(true);
    // const userInput = convertNewlines(userPrompt); // TODO: Do we need this?
    sendChatMessage(userInput, activeChat);
    setUserInput("");
  };

  return (
    <div className="chat-box">
      {loadingMessageState.loadingMessage ? (
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
            value={userInput}
          />
          <div className="chat-input-buttons">
            {hasSelection ? (
              <VSCodeButton
                title="Add selected code to chat"
                aria-label="Add selected code to chat"
                appearance="icon"
                onClick={addCodeToChat}
              >
                <i className="codicon codicon-code"></i>
              </VSCodeButton>
            ) : (
              <VSCodeButton
                title="Add current file to chat"
                aria-label="Add current file to chat"
                appearance="icon"
                onClick={addCodeToChat}
              >
                <i className="codicon codicon-file-code"></i>
              </VSCodeButton>
            )}
            <VSCodeButton
              title="Send message"
              aria-label="Send message"
              appearance="icon"
              onClick={handleSubmit}
              disabled={userInput.trim() === ""}
            >
              <i className="codicon codicon-send"></i>
            </VSCodeButton>
          </div>
        </form>
      )}
    </div>
  );
};
