import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { ChatViewMessageListener } from "./ChatViewMessageListener";
import { Conversation } from "../ChatModel/ChatModel";

// Inspired heavily by the vscode-webiew-ui-toolkit-samples > default > weather-webview
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts

// Also takes inspiration from the vscode-webview-ui-toolkit-samples > frameworks > hello-world-react-vite
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/src/panels/HelloWorldPanel.ts

export class ChatViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscode-byolad.chat";
  private _webviewView?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken,
  ) {
    // Store a reference to the webview view
    this._webviewView = webviewView;

    // Allow scripts in the webview
    this._webviewView.webview.options = {
      // Enable JavaScript in the webview
      enableScripts: true,
      // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "out"),
        vscode.Uri.joinPath(this._extensionUri, "webview-ui/build"),
      ],
    };

    // Set the HTML content that will fill the webview view
    this._webviewView.webview.html = this._getWebviewContent(
      this._webviewView.webview,
      this._extensionUri,
    );

    // Sets up an event listener to listen for messages passed from the webview view context
    // and executes code based on the message that is recieved
    this._setWebviewMessageListener(this._webviewView);

    // TODO: Figure out what these are for and if they are needed
    console.log(context);
    console.log(token);
  }

  /**
   * Sends a message to the webview view context to refresh the chat with the active conversation
   */
  public refresh(activeConversation: Conversation) {
    if (!this._webviewView) {
      vscode.window.showErrorMessage("No active webview view"); // How to handle?
      return;
    }
    this._webviewView.webview.postMessage({
      messageType: "refreshChat",
      params: {
        activeConversation: activeConversation,
      },
    });
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview view
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview view
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview view
   */
  private _getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
  ) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.css",
    ]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, [
      "webview-ui",
      "build",
      "assets",
      "index.js",
    ]);

    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <title>Hello World</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview view context
   *
   * @param webviewView
   */
  private _setWebviewMessageListener(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) =>
      ChatViewMessageListener.handleMessage(message),
    );
  }
}
