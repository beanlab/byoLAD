import "./App.css";
// const byo_LAD = "./circle_byo_LAD.png";
import byo_LAD from "./circle_byo_LAD.png";
import { useState } from "react";
import React from "react";
import { IconCommentLine } from "@instructure/ui-icons";
import { IconUserLine } from "@instructure/ui-icons";

class SendIcon extends React.Component {
  render() {
    return <IconCommentLine color="primary-inverse" title="Send" />;
  }
}
class UserIcon extends React.Component {
  render() {
    return <IconUserLine color="primary-inverse" height="12vmin" title="User" />;
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
  if (type === MessageType.User) {
    return (
      <div key={message} className="chat-text">
        {<UserIcon />}
        <div className="chat-text2">
          {message}
        </div>
      </div>
    );
  } else {
    return (
      <div key={message} className="chat-text">
        <img className="byoLAD" src={byo_LAD} alt="byoLAD" />
        <div className="chat-text2">
          {message}
        </div>
      </div>
    );
  }
}

function getResponse(userPrompt: string) {
  // TODO: get message from AI
  let message = userPrompt;
  message = "Welcome! byoLAD is happy to help you. Ask me anything about your code.";
  return message;
}

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState(Array<Message>());
  const [messageNumber, setMessageNumber] = useState(0);

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

  function newUserMessage(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const nextHistory = [...history.slice(0, messageNumber), new Message(userPrompt, MessageType.User)];
    setHistory(nextHistory);
    setMessageNumber(nextHistory.length);
    setUserPrompt("");
    askAI(nextHistory, nextHistory.length);
  }

  function newAIMessage(prevHistory: Message[], curmessageNumber: number, message: string) {
    // console.log(messageNumber);
    // console.log(history);
    const nextHistory = [...prevHistory.slice(0, curmessageNumber), new Message(message, MessageType.AI)];
    setHistory(nextHistory);
  }

  function completedAIMessage(prevHistory: Message[], curmessageNumber: number, message: string) {
    const nextHistory = [...prevHistory.slice(0, curmessageNumber), new Message(message, MessageType.AI)];
    setHistory(nextHistory);
    setMessageNumber(nextHistory.length);
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
          <p className="App-link">Explain selected code</p>
          <p className="App-link">Review selected code</p>
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
            <button type="submit"onClick={(e) => {newUserMessage(e);}}>
              {<SendIcon/>}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default App;
