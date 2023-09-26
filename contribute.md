# Contribute

Please feel free to contribute to our project. These are the instructions for contribution and local set up.

## Contribution Guidelines

- Once you have completed your changes, please submit a pull request to the main branch.
- Please include a description of your changes and how to test them manually in the pull request.
- The pull request will be reviewed by the team and merged if approved.
- Please follow the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) when contributing to this project.
- This project uses Prettier and ESLint. If your changes are not formatted correctly and do not pass linting, they will fail tests and not be able to be merged. We strongly suggest you follow the suggestions at the bottom to avoid this happening.

## Local Set Up

If you desire to run this extension locally, here are the steps to have it run properly.

### Specific instructions for setup

- Clone the repo.
- Run npm install.
- Copy the .vscode.sample folder and rename it to .vscode.

### To run the extension

- Press `F5` to open a new window with the extension loaded.
- Another "Extension Development Host" VS code window should open.
- With a file open, right click.
- Click "Review Code File".
- An error message may pop up saying "APIKey not set". If not, then it should have opened a new tab showing your code and the suggested changes.

> Note: The instructions for setting your APIKey in setting is [here](https://code.visualstudio.com/docs/getstarted/settings)

#### Helpful tips

- You can set breakpoints in the code to debug the extension.
- Find output from the extension in the debug console.

### Make changes

- You can relaunch the extension from the debug toolbar after changing code.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

### Run tests

- Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
- Press `F5` to run the tests in a new window with your extension loaded.
- See the output of the test result in the debug console.
- Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  - The provided test runner will only consider files matching the name pattern `**.test.ts`.
  - We have structured the test code folder in the same way as the source code folder `src`.

### Strongly suggested options

- Install the vscode-eslint and prettier-vscode extensions.
- Set Prettier as your default formatter in VS code settings.
- Turn on format on save in VS code settings.
