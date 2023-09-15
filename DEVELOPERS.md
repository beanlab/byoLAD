# Instructions for running locally

Here are the instructions for anyone who wants to run this extension locally. 

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
