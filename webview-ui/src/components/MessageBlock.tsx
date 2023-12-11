import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  darcula,
  vs,
  a11yLight,
  a11yDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { ExtensionMessenger } from "../utilities/ExtensionMessenger";
import Markdown from "react-markdown";
import { useContext, useState } from "react";
import { VsCodeThemeContext } from "../utilities/VsCodeThemeContext";
import { VsCodeTheme } from "../types";

interface CodeMessageBlockProps {
  languageId: string | undefined;
  children: string;
  extensionMessenger: ExtensionMessenger;
  deleteMessageBlock: () => void;
}
export const CodeMessageBlock: React.FC<CodeMessageBlockProps> = ({
  languageId,
  children,
  extensionMessenger,
  deleteMessageBlock,
}) => {
  const syntaxStyle = getThemedSyntaxStyle();
  const content: string = children;
  const noMargin = {
    margin: 0,
  };

  return (
    <div className="code-block-container message-block-container">
      {languageId ? (
        <SyntaxHighlighter
          language={languageId}
          style={syntaxStyle}
          customStyle={noMargin}
        >
          {content}
        </SyntaxHighlighter>
      ) : (
        <Markdown>{"```" + languageId + "\n" + content + "\n```"}</Markdown>
      )}
      <div className="code-button-container">
        <VSCodeButton
          appearance="icon"
          aria-label="Copy to clipboard"
          title="Copy to clipboard"
          onClick={() => extensionMessenger.copyToClipboard(content)}
        >
          <i className="codicon codicon-copy" />
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="Insert at cursor"
          title="Insert at cursor"
          onClick={() => extensionMessenger.insertCodeBlock(content)}
        >
          <i className="codicon codicon-insert" />
        </VSCodeButton>
        <VSCodeButton
          appearance="icon"
          aria-label="View diff in editor"
          title="View diff in editor"
          onClick={() => extensionMessenger.diffClodeBlock(content)}
        >
          <i className="codicon codicon-diff" />
        </VSCodeButton>
        <DeleteMessageBlockButton
          deleteMessageBlock={deleteMessageBlock}
          codeBlock={true}
        />
      </div>
    </div>
  );
};

interface TextMessageBlockProps {
  children: string;
  deleteMessageBlock: () => void;
}

export const TextMessageBlock: React.FC<TextMessageBlockProps> = ({
  children,
  deleteMessageBlock,
}) => {
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);

  return (
    <div
      className="text-block-container message-block-container"
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <Markdown>{children}</Markdown>
      {showDeleteButton ? (
        <div className="text-block-delete-button">
          <DeleteMessageBlockButton
            deleteMessageBlock={deleteMessageBlock}
            codeBlock={false}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

/**
 * Returns the appropriate code syntax highlighting style based on the current VS Code theme
 * @returns The code syntax highlighting style
 */
function getThemedSyntaxStyle(): {
  [key: string]: React.CSSProperties;
} {
  const currentTheme = useContext(VsCodeThemeContext);
  let syntaxStyle;
  switch (currentTheme) {
    case VsCodeTheme.Dark:
      syntaxStyle = darcula;
      break;
    case VsCodeTheme.HighContrastDark:
      syntaxStyle = a11yDark;
      break;
    case VsCodeTheme.Light:
      syntaxStyle = vs;
      break;
    case VsCodeTheme.HighContrastLight:
      syntaxStyle = a11yLight;
      break;
    default:
      syntaxStyle = darcula;
      break;
  }
  return syntaxStyle;
}

const DeleteMessageBlockButton = ({
  deleteMessageBlock,
  codeBlock,
}: {
  deleteMessageBlock: () => void;
  codeBlock: boolean;
}) => {
  const title = codeBlock ? "Remove code block" : "Remove text block";

  return (
    <VSCodeButton
      appearance="icon"
      aria-label={title}
      title={title}
      onClick={deleteMessageBlock}
    >
      <i className="codicon codicon-trash" />
    </VSCodeButton>
  );
};
