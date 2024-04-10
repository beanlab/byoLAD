# Contribute

Please feel free to contribute to our project. These are the instructions for contribution and local setup.

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
- Run `npm run install:all`.
- Copy the .vscode.sample folder and rename it to .vscode.

### To run the extension

- Run `npm run build:webview`
- Press `F5` to open a new window with the extension loaded.
- Another "Extension Development Host" VS code window should open.
- With a file open, highlight some code and then right click. Click "Add Code To Chat".
- Add some message and then hit enter
- An error message may pop up saying "APIKey not set". If not, then it should responded.

> Note: The instructions for setting your APIKey in setting is [here](README.md)

#### Helpful tips

- You can set breakpoints in the code to debug the extension.
- Find output from the extension in the debug console.

### Make changes

- You can relaunch the extension from the debug toolbar after changing code.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.
- Run `npm run build:webview` whenever you make changes within the `webview-ui` folder.

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

## How to Publish the Extension

Review the VS Code [documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) regarding publishing extensions to the VS Code Marketplace.

We use [semantic versioning](https://semver.org/).

Follow these steps to publish a new version of the extension:

1. Increment the extension version number as needed. This should be done in `package.json` and `webview-ui/package.json`.
2. Merge all desired changes into the `main` branch following all PR and code review practices.
3. Create a release branch off of `main` to act as a checkpoint, following the naming convention `RELEASE-{version}` (e.g., version 1.2.3 should have the release branch `RELEASE-1.2.3`).
4. Create a new [release](https://github.com/beanlab/byoLAD/releases) through GitHub. Note the following:
   1. Create a new tag whose name is the version number (e.g., `1.2.3`).
   2. Target the release branch created above (e.g., `RELEASE-1.2.3`).
   3. Set the release title as the version number (e.g., `1.2.3`).
   4. Provide a useful description of the release.
   5. Set as the repo's latest release (checkbox).
5. Check [GitHub Actions](https://github.com/beanlab/byoLAD/actions) to ensure the "Publish" job ran successfully. Check the [workflows](https://github.com/beanlab/byoLAD/tree/main/.github/workflows) on the `main` branch to see how this is done.
6. Wait several minutes for the new version to be available in the VS Code Marketplace.

There are more ways to expand how we use tools like GitHub Actions and `vsce` to automate this workflow further. This documentation should be updated if these are used.
