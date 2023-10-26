import * as vscode from "vscode";
import {
  ChatMessage,
  ChatRole,
  CodeBlock,
  MessageBlock,
} from "../ChatModel/ChatModel";
import { ConversationManager } from "./conversationManager";
import { Conversation } from "../ChatModel/ChatModel";

export function outputConversationHtml(
  conversationManager: ConversationManager,
) {
  // <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"> -->
  // <!--
  //     <link href="${styleResetUri}" rel="stylesheet">
  //     <link href="${styleVSCodeUri}" rel="stylesheet">
  //     <link href="${styleMainUri}" rel="stylesheet"> -->
  //     <!-- <script nonce="${nonce}" src="${scriptUri}"></script> -->
  const activeConversationId = conversationManager.activeConversationId;
  if (!activeConversationId) {
    vscode.window.showErrorMessage("No active conversation");
    return;
  }
  const conversation =
    conversationManager.getConversation(activeConversationId);
  if (!conversation) {
    vscode.window.showErrorMessage(
      "Conversation with id " + activeConversationId + " not found",
    );
    return;
  }

  const html = `<!doctype html>
  <html lang="en">

    <head>
      <meta charset="UTF-8" />
  
      <!--
            Use a content security policy to only allow loading styles from our extension directory,
            and only allow scripts that have a specific nonce.
            (See the 'webview-sample' extension sample for img-src content security policy examples)
          -->
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>byoLAD: Code Chat</title>
    </head>
    <body>
      ${getConversationListHtml(conversationManager)}
      ${getConversationHtml(conversation)}
    </body>
  </html>`;

  vscode.window
    .createOutputChannel("vscode-byolad: Code Chat HTML")
    .append(html);
}
function getConversationListHtml(conversationManager: ConversationManager) {
  let html = "<h2>Conversation History</h2><ul>";
  for (const preview of conversationManager.getConversationPreviews()) {
    html += `<li>${preview.id}: ${preview.name}</li>`;
  }
  return (html += "</ul><br>");
}
function getConversationHtml(conversation: Conversation): string {
  let html = `<h1>${conversation.name} (#${conversation.id})</h1><br>`;
  html += conversation.messages
    .map((message) => {
      return getMessageHtml(message);
    })
    .join("<br>");
  return html;
}
function getMessageHtml(message: ChatMessage): string {
  switch (message.role) {
    case ChatRole.System:
      return `<div class='system-message'>
        <h3>${message.role}</h3>
        ${getMessageBlocksHtml(message.content)}
      </div>`;
    case ChatRole.User:
      return `<div class='user-message'>
        <h3>${message.role}</h3>
        ${getMessageBlocksHtml(message.content)}
      </div>`;
    case ChatRole.Assistant:
      return `<div class='assistant-message'>
        <h3>${message.role}</h3>
        ${getMessageBlocksHtml(message.content)}
      </div>`;
    default:
      return `<div class='unknown-message'>
        <h3>${message.role}</h3>
        ${getMessageBlocksHtml(message.content)}
      </div>`;
  }
}
function getMessageBlocksHtml(messageBlock: MessageBlock[]): string {
  let html = "";
  for (const block of messageBlock) {
    switch (block.type) {
      case "text":
        html += `<p>${block.content}</p>`;
        break;
      case "code": {
        const codeBlock = block as CodeBlock;
        if (codeBlock.languageId) {
          html += `<p>Language: ${codeBlock.languageId}</p>`;
        }
        if (codeBlock.linesInUserSourceFile) {
          html += `<p>Lines ${codeBlock.linesInUserSourceFile.start} - ${codeBlock.linesInUserSourceFile.end}</p>`;
        }
        html += `<pre>${block.content}</pre>`;
        break;
      }
      default:
        html += `<p>Unknown message block type ${block.type}</p>`;
        break;
    }
  }
  return html;
}
