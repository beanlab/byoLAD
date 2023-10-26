import "./App.css";
import byo_LAD from "./circle_byo_LAD.png";
import { useState } from "react";
import React from "react";
import {
  ExplainCodeRequest,
  ExtensionToWebviewMessage,
  RefreshChatRequest,
  ReviewCodeRequest,
} from "./utilities/WebviewExtensionMessages";
import { vscode } from "./utilities/vscode";
import { VSCodeButton, VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";

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
  if (type === MessageType.User) {
    return (
      <div key={message} className="chat-text">
        {/* <UserIcon /> */}
        <div className="chat-text2">{message}</div>
      </div>
    );
  } else {
    return (
      <div key={message} className="chat-text">
        <img className="byoLAD" src={byo_LAD} alt="byoLAD" />
        <div className="chat-text2">{message}</div>
      </div>
    );
  }
}

function getResponse(userPrompt: string) {
  // TODO: get message from AI
  let message = userPrompt;
  message =
    "Welcome! byoLAD is happy to help you. Ask me anything about your code.";
  return message;
}

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState(Array<Message>());
  const [messageNumber, setMessageNumber] = useState(0);
  const [includeCode] = useState(true);

  window.addEventListener("message", (event) => {
    switch ((event.data as ExtensionToWebviewMessage).command) {
      case "refreshChat": {
        const request = event.data as RefreshChatRequest;
        console.log("refreshChat", request); // TODO: Do something with this though
        const conversation = request.conversation;
        const lastMessage =
          conversation.messages[conversation.messages.length - 1];
        newAIMessage(history, messageNumber, JSON.stringify(lastMessage));
        break;
      }
      default:
        // TODO: How to handle?
        console.log("Unknown command. Event received: ", event);
        break;
    }
  });

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

  function reviewCode() {
    // TODO: There is a better way to send different types of messages. This is just a placeholder.
    vscode.postMessage({
      command: "reviewCode",
    } as ReviewCodeRequest);
  }

  function explainCode() {
    // TODO: There is a better way to send different types of messages. This is just a placeholder.
    vscode.postMessage({
      command: "explainCode",
    } as ExplainCodeRequest);
  }

  const messages = history.map((message, position) => {
    console.log(position);
    const retVal = createChatText(message.message, message.type);
    return retVal;
  });

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
          <VSCodeButton onClick={reviewCode}>Review Code</VSCodeButton>
          <br />
          {/* TODO: Use React or vscode-webview-ui-toolkit stuff (or CSS I guess) to format this */}
          <VSCodeButton onClick={explainCode}>Explain Code</VSCodeButton>
          <div className="chat-wrap">
            <div className="chat-wrap2">{messages}</div>
          </div>
        </div>
      </div>

      <footer className="App-footer">
        <div className="chat-box">
          <VSCodeCheckbox checked={includeCode} value={includeCode.toString()}>
            Include Code Reference
          </VSCodeCheckbox>
          <form className="chat-bar" name="chatbox">
            {/* TODO: There's a better way for the user to include their selected code or the document or not use it as additional context. */}
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
              {/* <MyIcon /> */}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;
