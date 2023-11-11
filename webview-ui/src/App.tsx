import "./App.css";
import byo_LAD from "../../media/circle_byolad.png";
import { useState } from "react";
import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { Conversation } from "./utilities/ChatModel";
import {
  ExtensionToWebviewMessage,
  RefreshChatMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { IconCommentLine } from "@instructure/ui-icons";
import { IconUserLine } from "@instructure/ui-icons";

class SendIcon extends React.Component {
  render() {
    return <IconCommentLine color="primary-inverse" title="Send" />;
  }
}
class UserIcon extends React.Component {
  render() {
    return (
      <IconUserLine color="primary-inverse" height="12vmin" title="User" />
    );
  }
}

enum MessageType {
  User,
  AI,
}

class Message {
  message: string;
  type: MessageType;

  constructor(message: string, type: MessageType) {
    this.message = message;
    this.type = type;
  }
}

function createChatText(message: string, type: MessageType) {
  return (
    <div key={message} className="chat-text">
      {type === MessageType.User ? (
        <UserIcon />
      ) : (
        <img className="byoLAD" src={byo_LAD} alt="byoLAD" />
      )}
      <div className="chat-text2">{message}</div>
    </div>
  );
}

function getResponse(userPrompt: string) {
  // TODO: get message from AI
  let message = userPrompt;
  message =
    "Welcome! byoLAD is happy to help you. Ask me anything about your code. TODO: Responses from the extension context are just being logged to the webview dev console right now.";
  return message;
}

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState(Array<Message>());
  const [messageNumber, setMessageNumber] = useState(0);

  const extensionMessenger = new ExtensionMessenger();

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newval = event.target.value;
    setUserPrompt(newval);
  };

  function askAI(prevHistory: Message[], curmessageNumber: number) {
    let message = "Loading...";
    newAIMessage(prevHistory, curmessageNumber, message);
    message = getResponse(userPrompt);
    completedAIMessage(prevHistory, curmessageNumber, message);
  }

  function newUserMessage(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) {
    extensionMessenger.sendChatMessage(userPrompt, true); // TODO: identify if they want to use the selected code/whole file as a code reference to the model

    e.preventDefault();
    const nextHistory = [
      ...history.slice(0, messageNumber),
      new Message(userPrompt, MessageType.User),
    ];
    setHistory(nextHistory);
    setMessageNumber(nextHistory.length);
    setUserPrompt("");
    askAI(nextHistory, nextHistory.length);
  }

  function newAIMessage(
    prevHistory: Message[],
    curmessageNumber: number,
    message: string,
  ) {
    // console.log(messageNumber);
    // console.log(history);
    const nextHistory = [
      ...prevHistory.slice(0, curmessageNumber),
      new Message(message, MessageType.AI),
    ];
    setHistory(nextHistory);
  }

  function completedAIMessage(
    prevHistory: Message[],
    curmessageNumber: number,
    message: string,
  ) {
    const nextHistory = [
      ...prevHistory.slice(0, curmessageNumber),
      new Message(message, MessageType.AI),
    ];
    setHistory(nextHistory);
    setMessageNumber(nextHistory.length);
  }

  const messages = history.map((message, position) => {
    console.log(position);
    const retVal = createChatText(message.message, message.type);
    return retVal;
  });

  /**
   * Handle messages sent from the extension to the webview
   */
  window.addEventListener("message", (event) => {
    const message = event.data as ExtensionToWebviewMessage;
    switch (message.messageType) {
      case "refreshChat": {
        const params = message.params as RefreshChatMessageParams;
        const conversation = params.activeConversation as Conversation | null;
        console.log("Active Conversation: ", conversation);
        // TODO: Handle refresh request (which contains the contents of the active conversation, including any messages that have just been received)
        // Display the new messages from the model or completely change the chat history in line with the provided active conversation
        // How should we display there being no active conversation? Should that even be an option or should there always have to be something?
        break;
      }
      default:
        // TODO: How to handle?
        console.log("Unknown event 'message' received: ", event);
        break;
    }
  });

  return (
    <div className="App">
      <div className="App-body">
        <div className="App-body1">
          <p>
            Here you can chat with the AI about your code. You can ask whatever
            you want, but the best is to ask question about your code or
            generating new code.
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
            <VSCodeButton onClick={extensionMessenger.newConversaiton}>
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
            <div className="chat-wrap2">{messages}</div>
          </div>
        </div>
      </div>

      <footer className="App-footer">
        <div className="chat-box">
          <form className="chat-bar" name="chatbox">
            <input
              onChange={change}
              value={userPrompt}
              type="text"
              placeholder="Ask a question to the AI"
            />
            <button
              type="submit"
              onClick={(e) => {
                newUserMessage(e);
              }}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;