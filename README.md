# A Super Cool Extension

This extension is an open-source AI extension to assist with reviewing and generating code developed by a professor and students at Brigham Young University. This extension is here to help with general code review abilities that cover looking for bugs, suggesting different naming, and making the code look cleaner. In addition to code review, this extension helps generate code as you type. If the code doesn't seem exactly how you wanted it, you can ask it to make modifications to the code that it generated for you. Overall, this extension is here to help streamline your development process while providing the flexibility of different APIs. 

## Features

This AI platform is an open-source AI extension. Some of the main features are code review, code completion, and code discussion. The extension also allows for any type of API to be used. You can use whatever AI API you are currently using or comfortable with. 

### Code Review

This extension has the option of reviewing a whole file or reviewing selected code. When it reviews your code, it will look for bugs in the code and look for general naming problems. In addition, it will suggest getting rid of or adding spacing to make the code easier to read. When you ask it to review your code, it will open another tab showing a dif view of your code and the code that it suggests. You can then choose which changes you will add to your code. 

### Code Completion

This extension will help as you type to complete the code for you. With the tool, you can have it generate functions and other snippets of code. It will analyze what you have written so far, and it will suggest what it thinks you want. 

### Code Discussion

This extension also allows you to discuss or modify the generated code. Instead of trying to find the right prompt to get the code you are looking for, you can suggest changes to the proposed code until you have the code you want. 

## Requirements

The only requirement needed if not running locally would be to set your API key in the setting, which is explained in this document. You will have to get your own API key for the AI service you would like to use like OpenAI or ChatGPT. 

<a target="_blank" href="https://code.visualstudio.com/docs/getstarted/settings">How to set your API key</a>

## Local Set Up

If you desire to run this extension locally, here are the steps to have it run properly. 

#### Specific instructions for setup:
1. Clone the repo.
2. Run npm install.
3. Copy the .vscode.sample folder and rename it to .vscode.

#### To verify that it's working:
1. With VS code open, press F5.
2. Another "Extension Development Host" VS code window should open.
3. With a file open, right click.
4. Click "Review Code File".
5. An error message may pop up saying "APIKey not set". If not, then it should have opened a new tab showing your code and the suggested changes.

> Note: The instructions for setting your APIKey in setting is <a target="_blank" href="https://code.visualstudio.com/docs/getstarted/settings">here</a>

#### Strongly suggested options
- Install the vscode-eslint and prettier-vscode extensions.
- Set Prettier as your default formatter in VS code settings.
- Turn on format on save in VS code settings.

**Enjoy!**
