import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";
import { WebviewToExtensionMessageHandler } from "./WebviewToExtensionMessageHandler";
import { ExtensionToWebviewMessage } from "../../shared/types";

// Inspired heavily by the vscode-webiew-ui-toolkit-samples > default > weather-webview
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts

// Also takes inspiration from the vscode-webview-ui-toolkit-samples > frameworks > hello-world-react-vite
// https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/src/panels/HelloWorldPanel.ts

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
  public readonly viewId = "vscode-byolad.chat";
  private _webviewView?: vscode.WebviewView;
  private readonly _extensionUri: vscode.Uri;
  private webviewToExtensionMessageHandler?: WebviewToExtensionMessageHandler;

  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  public setChatWebviewMessageHandler(
    webviewToExtensionMessageHandler: WebviewToExtensionMessageHandler,
  ) {
    this.webviewToExtensionMessageHandler = webviewToExtensionMessageHandler;
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

    console.log(context);
    console.log(token);
  }

  /**
   * Shows and focuses on the webview view in the sidebar.
   * @param preserveFocus A boolean indicating whether the current focus should be preserved (defaults to false and focuses on the webview).
   */
  async show(preserveFocus: boolean = false) {
    const options = { preserveFocus: preserveFocus };
    try {
      await vscode.commands.executeCommand(`${this.viewId}.focus`, options);
    } catch (error) {
      await vscode.window.showErrorMessage(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Sends a message to the webview view.
   * @param message The message to send to the webview view.
   * @returns A boolean indicating whether the message was posted successfully (not if it was received successfully).
   */
  public async postMessage(
    message: ExtensionToWebviewMessage,
  ): Promise<boolean> {
    if (!this._webviewView) {
      await vscode.window.showErrorMessage(
        "No active webview to communicate with. Please try reloading the window or restarting the extension.",
      );
      return false;
    }

    return await this._webviewView.webview.postMessage(message);
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
      if (!this.webviewToExtensionMessageHandler) {
        vscode.window.showErrorMessage(
          "Extension unable to receive communication from the webview. Please try reloading the window or restarting the extension.",
        );
        return;
      }
      await this.webviewToExtensionMessageHandler.handleMessage(message);
    });
  }
}
