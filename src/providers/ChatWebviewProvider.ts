import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { ChatWebviewMessageHandler } from "./ChatWebviewMessageHandler";
import {
  Chat,
  ExtensionToWebviewMessage,
  ExtensionToWebviewMessageType,
  ExtensionToWebviewMessageTypeParamsMap,
} from "../../shared/types";
import { ChatDataManager } from "../Chat/ChatDataManager";

// Inspired heavily by the vscode-webiew-ui-toolkit-samples > default > weather-webview
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts

// Also takes inspiration from the vscode-webview-ui-toolkit-samples > frameworks > hello-world-react-vite
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/src/panels/HelloWorldPanel.ts

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vscode-byolad.chat";
  private _webviewView?: vscode.WebviewView;
  private readonly _extensionUri: vscode.Uri;
  private readonly chatDataManager: ChatDataManager;
  private chatWebviewMessageHandler?: ChatWebviewMessageHandler;

  constructor(extensionUri: vscode.Uri, chatDataManager: ChatDataManager) {
    this._extensionUri = extensionUri;
    this.chatDataManager = chatDataManager;
  }

  public setChatWebviewMessageHandler(
    chatWebviewMessageHandler: ChatWebviewMessageHandler,
  ) {
    this.chatWebviewMessageHandler = chatWebviewMessageHandler;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken,
  ) {
    this._webviewView = webviewView;

    this._webviewView.webview.options = {
      // Enable JavaScript in the webview
      enableScripts: true,
      // Restrict the webview to only load resources from certain directories
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, "out"),
        vscode.Uri.joinPath(this._extensionUri, "webview-ui/build"),
        vscode.Uri.joinPath(this._extensionUri, "media"),
        vscode.Uri.joinPath(
          this._extensionUri,
          "webview-ui/node_modules/@vscode/codicons/dist",
        ),
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
   * Refreshes the webview to reflect the current state of the chat manager, including
   * the list of chats and the active chat.
   */
  public refresh() {
    if (!this._webviewView) {
      vscode.window.showErrorMessage("No active webview view"); // How to handle?
      return;
      // can I cause the webview to be focused on here?
      // TODO: This is where the webview should be opened!
    }
    const chats: Chat[] = this.chatDataManager.chats;
    const activeChatId: number | null = this.chatDataManager.activeChatId;
    if (activeChatId && !chats.find((chat) => chat.id === activeChatId)) {
      vscode.window.showErrorMessage(
        `Active chat with ID ${activeChatId} does not exist`,
      );
      return;
    }

    const messageType: ExtensionToWebviewMessageType = "refresh";
    this._webviewView.webview.postMessage({
      messageType: messageType,
      params: {
        chats: chats,
        activeChatId: activeChatId,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to display an error message.
   * @param errorMessage The error message to display.
   */
  public updateErrorMessage(errorMessage: string) {
    if (!this._webviewView) {
      vscode.window.showErrorMessage(errorMessage);
      return;
    }

    const messageType: ExtensionToWebviewMessageType = "errorMessage";
    this._webviewView.webview.postMessage({
      messageType: messageType,
      params: {
        errorMessage: errorMessage,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to reflect whether or not a message is currently loading.
   * @param isLoading If the message is loading.
   */
  public updateIsMessageLoading(isLoading: boolean) {
    if (!this._webviewView) {
      vscode.window.showErrorMessage("No active webview view"); // How to handle?
      return;
      // TODO: This is where the webview should be opened!
    }

    const messageType: ExtensionToWebviewMessageType = "isMessageLoading";
    this._webviewView.webview.postMessage({
      messageType: messageType,
      params: {
        isLoading: isLoading,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);
  }

  /**
   * Updates the webview to reflect whether or not there is currently a selection in the editor.
   * @param hasSelection If something is currently selected in the editor.
   */
  public async updateHasSelection(hasSelection: boolean) {
    // TODO: make sure they are using this async function right
    if (!this._webviewView) {
      vscode.window.showErrorMessage("No active webview view");
      return;
    }

    const messageType: ExtensionToWebviewMessageType = "hasSelection";
    const ifDelivered = await this._webviewView.webview.postMessage({
      messageType: messageType,
      params: {
        hasSelection: hasSelection,
      } as ExtensionToWebviewMessageTypeParamsMap[typeof messageType],
    } as ExtensionToWebviewMessage);

    if (!ifDelivered) {
      // TODO: Do this with all of the messages
      vscode.window.showErrorMessage(
        `Failed to deliver message of type ${messageType} to webview`,
      );
    }
  }

  public isWebviewVisible(): boolean {
    return this._webviewView != null && this._webviewView.visible;
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
    // The VS Codicon CSS reference (as used in the CatCodicons sample @ https://github.com/microsoft/vscode-extension-samples/tree/22d5639ff5c1d88f144c057fc3d29cc9dfd99d62/webview-codicons-sample)
    const codiconsUri = getUri(webview, extensionUri, [
      "webview-ui",
      "node_modules",
      "@vscode",
      "codicons",
      "dist",
      "codicon.css",
    ]);

    const nonce = getNonce();

    const imagePaths = {
      byoLadCircleImageUri: getUri(webview, extensionUri, [
        "media",
        "circle_byolad.png",
      ]).toString(),
    };

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${
              webview.cspSource
            }; font-src ${webview.cspSource}; img-src ${
              webview.cspSource
            }; script-src 'nonce-${nonce}';">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
            <link rel="stylesheet" type="text/css" href="${codiconsUri}">
          </head>
          <body>
            <div id="root"></div>
            <script nonce="${nonce}"> <!-- Provides the React app access to the properly formatted resource URIs -->
              window.initialState = ${JSON.stringify({ imagePaths })};
            </script>
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
    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (!this.chatWebviewMessageHandler) {
        vscode.window.showErrorMessage(
          // TODO: Is this the right way to handle this?
          "ChatWebviewMessageHandler not set in ChatWebviewProvider",
        );
        return;
      }
      await this.chatWebviewMessageHandler.handleMessage(message);
    });
  }
}
