import { useState } from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ChatRole, Conversation, TextBlock } from "../utilities/ChatModel";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
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

  const deleteMessageBlock = (
    messagePosition: number,
    messageBlockPosition: number,
  ) => {
    console.log("Active chat");
    console.log(activeChat);
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
    console.log("new chat");
    console.log(newChat);
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

  return (
    <div className="App">
      <img src={imagePaths.byoLadCircleImageUri} width="50%" />
      <div className="App-body">
        <div className="App-body1">
          <p>
            Here you can chat with the AI about your code. You can ask whatever
            you want, but the best is to ask question about your code or
            generating new code.
          </p>
          <div>
            <VSCodeButton onClick={() => changeActiveChat(null)}>
              Back
            </VSCodeButton>
            <br />
            <VSCodeButton onClick={extensionMessenger.reviewCode}>
              Review Code
            </VSCodeButton>
            <br />
            <VSCodeButton onClick={extensionMessenger.explainCode}>
              Explain Code
            </VSCodeButton>
            <br />
            <VSCodeButton onClick={extensionMessenger.newConversation}>
              New Conversation
            </VSCodeButton>
            <br />
            <VSCodeButton onClick={extensionMessenger.deleteAllConversations}>
              Delete All Conversations
            </VSCodeButton>
            <br />
            <VSCodeButton
              onClick={() => extensionMessenger.getCodeBlock(activeChat.id)}
            >
              Add Code
            </VSCodeButton>
            <br />
          </div>
          <div>{messages}</div>
        </div>
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
              placeholder="Ask a question to the AI"
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
      </footer>
    </div>
  );
};
