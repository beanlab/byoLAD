import { useState } from "react";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ChatRole, Conversation, TextBlock } from "../utilities/ChatModel";
import { ChatMessageView } from "./ChatMessageView";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { SendIcon } from "./SendIcon";
const byo_LAD = "./circle_byo_LAD.png";

interface ChatViewProps {
  activeChat: Conversation;
  setActiveChat: (conversation: Conversation | null) => void;
}

export const ChatView = ({ activeChat, setActiveChat }: ChatViewProps) => {
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
    extensionMessenger.sendChatMessage(userPrompt, true); // TODO: identify if they want to use the selected code/whole file as a code reference to the model
    const newUserMessage = {
      content: [
        {
          type: "text",
          content: userPrompt,
        } as TextBlock,
      ],
      role: ChatRole.User,
    };
    const updatedChat = { ...activeChat };
    updatedChat.messages.push(newUserMessage);
    setActiveChat(updatedChat);
    setUserPrompt("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={byo_LAD} className="App-logo" alt="logo" />
      </header>
      <div className="App-body">
        <div className="App-body1">
          <p>
            Here you can chat with the AI about your code. You can ask whatever
            you want, but the best is to ask question about your code or
            generating new code. The best is to ask the AI to explain, review,
            or generate code.
          </p>
          <div>
            {/*
              TODO: This is just showing how it all connects. The way to call the extenionMessenger will obviously be different for some of these buttons.
              TODO: Use React or vscode-webview-ui-toolkit stuff (or CSS I guess) to format this
            */}
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
            <VSCodeButton onClick={extensionMessenger.diffClodeBlock}>
              Diff Code Block
            </VSCodeButton>
          </div>
          <div className="chat-wrap">
            <div className="chat-wrap2">
              {activeChat.messages.map((message) => (
                <ChatMessageView chatMessage={message} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="App-footer">
        <div className="chat-box">
          <form className="chat-bar" name="chatbox">
            <input
              onChange={handleInputOnChange}
              value={userPrompt}
              type="text"
              placeholder="Ask a question to the AI"
            />
            <button
              type="submit"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};
