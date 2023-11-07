import "./App.css";
import byo_LAD from "./circle_byo_LAD.png";
import { useState } from "react";
import React from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ChatRole, Conversation } from "./utilities/ChatModel";
import {
  ExtensionToWebviewMessage,
  RefreshChatMessageParams,
} from "./utilities/ExtensionToWebviewMessage";
import { ExtensionMessenger } from "./utilities/ExtensionMessenger";
import { SendIcon } from "./components/SendIcon";
import { ChatMessage } from "./utilities/ChatModel";
import { Message } from "./components/Message";

// function getResponse(userPrompt: string) {
//   // TODO: get message from AI
//   let message = userPrompt;
//   message =
//     "Welcome! byoLAD is happy to help you. Ask me anything about your code. TODO: Responses from the extension context are just being logged to the webview dev console right now.";
//   return message;
// }

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [history, setHistory] = useState(Array<ChatMessage>());
  // const [messageNumber, setMessageNumber] = useState(0);

  const extensionMessenger = new ExtensionMessenger();

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newval = event.target.value;
    setUserPrompt(newval);
  };

  // function askAI(prevHistory: ChatMessage[], curmessageNumber: number) {
  //   let message = "Loading...";
  //   newAIMessage(prevHistory, curmessageNumber, message);
  //   message = getResponse(userPrompt);
  //   completedAIMessage(prevHistory, curmessageNumber, message);
  // }

  const handleSubmit = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    newUserMessage();
  };

  function newUserMessage() {
    extensionMessenger.sendChatMessage(userPrompt, true); // TODO: identify if they want to use the selected code/whole file as a code reference to the model
    // const nextHistory = [
    //   ...history.slice(0, messageNumber),
    //   {
    //     content: [
    //       {
    //         type: "text",
    //         content: userPrompt,
    //       } as TextBlock,
    //     ],
    //     role: ChatRole.User,
    //   } as ChatMessage,
    // ];
    // setHistory(nextHistory);
    // setMessageNumber(nextHistory.length);
    // setUserPrompt("");
    // askAI(nextHistory, nextHistory.length);
  }

  // function newAIMessage(
  //   prevHistory: ChatMessage[],
  //   curmessageNumber: number,
  //   message: string,
  // ) {
  //   console.log("In `newAIMessage` function"); // TODO: DELETE ME
  //   // console.log(messageNumber);
  //   // console.log(history);
  //   const nextHistory = [
  //     ...prevHistory.slice(0, curmessageNumber),
  //     {
  //       content: [
  //         {
  //           type: "text",
  //           content: message,
  //         } as TextBlock,
  //       ],
  //       role: ChatRole.Assistant,
  //     } as ChatMessage,
  //   ];
  //   setHistory(nextHistory);
  // }

  // function completedAIMessage(
  //   prevHistory: ChatMessage[],
  //   curmessageNumber: number,
  //   message: string,
  // ) {
  //   console.log("In `completedAIMessage` function"); // TODO: DELETE ME
  //   const nextHistory = [
  //     ...prevHistory.slice(0, curmessageNumber),
  //     {
  //       content: [
  //         {
  //           type: "text",
  //           content: message,
  //         } as TextBlock,
  //       ],
  //       role: ChatRole.Assistant,
  //     } as ChatMessage,
  //   ];
  //   setHistory(nextHistory);
  //   setMessageNumber(nextHistory.length);
  // }

  const messages = history.map((message, position) => {
    console.log(position);
    if (message.role != ChatRole.System) {
      return <Message role={message.role} messageBlocks={message.content} />;
    }
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
        console.log("Active Conversation: ", conversation); // TODO: DELETE ME
        setHistory(conversation?.messages ?? []);
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
          <div>{messages}</div>
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
}

export default App;
