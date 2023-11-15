import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { ChatRole, CodeBlock, MessageBlock } from "../utilities/ChatModel";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import { ImagePaths } from "../types";
import { CodeMessageBlock } from "./MessageBlock";
import { TextMessageBlock } from "./MessageBlock";

interface MessageProps {
  role: ChatRole;
  messageBlocks: MessageBlock[];
  extensionMessenger: ExtensionMessenger;
  imagePaths?: ImagePaths;
}
export const Message: React.FC<MessageProps> = ({
  role,
  messageBlocks,
  extensionMessenger,
  imagePaths,
}) => (
  <div>
    <VSCodeDivider role="separator" />
    <div className="message">
      <MessageHeader role={role} assistantIconUri={imagePaths?.byoladIconUri} />
      <div className="message-block">
        {messageBlocks.map((messageBlock) => {
          if (messageBlock.type === "text") {
            return <TextMessageBlock>{messageBlock.content}</TextMessageBlock>;
          } else if (messageBlock.type === "code") {
            return (
              <CodeMessageBlock
                languageId={(messageBlock as CodeBlock).languageId}
                extensionMessenger={extensionMessenger}
              >
                {messageBlock.content}
              </CodeMessageBlock>
            );
          } else {
            console.log(`Unknown message block type: ${messageBlock.type}`);
            return <></>;
          }
        })}
      </div>
    </div>
  </div>
);

interface MessageHeaderProps {
  role: ChatRole;
  assistantIconUri?: string;
}
const MessageHeader: React.FC<MessageHeaderProps> = ({
  role,
  assistantIconUri,
}) => {
  switch (role) {
    case ChatRole.User:
      return (
        <div className="message-header">
          <i className="codicon codicon-account"></i>
          <div className="role-name">You</div>
        </div>
      );
    case ChatRole.Assistant:
      return (
        <div className="message-header">
          {assistantIconUri ? (
            <img src={assistantIconUri} alt="Assistant Icon" />
          ) : (
            <i className="codicon codicon-hubot"></i>
          )}
          <div className="role-name">byoLAD</div>
        </div>
      );
    case ChatRole.System:
      console.log("System messages should not be displayed");
      return <></>;
    default:
      return <></>;
  }
};
