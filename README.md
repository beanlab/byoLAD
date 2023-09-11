# vs-code-ai-extension README

This is an open-source AI extension to assist with reviewing and generating code. 

## Features

This AI platform is an open-source AI extension. Some of the main features are code review, code completion, and code discussion. The extension also allows for any type of API to be used. You can use whatever AI API you are currently using or comfortable with. 

### Code Review

This extension has the option of reviewing a whole file or reviewing selected code. 

### Code Completion

This extension will help as you type to complete the code for you. With the tool, you can have it generate functions and other snippets of code. 

### Code Discussion

This extension also allows you to discuss or modify the suggested code. Instead of trying to find the right prompt to get the code you are looking for, you can suggest changes to the proposed code until you have the code you want. 

## Requirements

The only requirement needed if not running locally would be to set your API key in the setting, which is explained in this document.

<a target="_blank" href="https://code.visualstudio.com/docs/getstarted/settings">Settings</a>

## Local Set Up

If you desire to run this extension locally, here are the steps to have it run properly. 

#### Specific instructions for setup to be updated as needed:
1. Clone the repo.
2. Run npm install.
3. Copy the .vscode.sample folder and rename it to .vscode.

#### To verify that it's working:
1. With VS code open, press F5.
2. Another "Extension Development Host" VS code window should open.
3. With a file open, right click.
4. Click "Review Code File".
5. An error message should pop up saying "APIKey not set".

> Note: The instructions for setting your APIKey are in the section above (Requirements)

#### Strongly suggested options
- Install the vscode-eslint and prettier-vscode extensions.
- Set Prettier as your default formatter in VS code settings.
- Turn on format on save in VS code settings.

## Extension Settings
Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
