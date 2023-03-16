# Github Finder

## Description

Write a React Native application with the following features:

1. It allows user to input a GitHub repository name in the following format: “<owner>/<repository>“, e.g. “bright/shouldko”.

2. When the repository name is provided, the app fetches and displays the following information about it using GitHub API:

- repository ID,

- the list of the commits in the repository:

  - each commit should be described by: message, SHA value, author’s name;

  - the list should be sorted by date so that the latest commits are at the top (just like on GitHub).

3. The app caches the previously used repositories data.

- The user can access the history of last used repositories.

  - Using the history, the user can open the repository information again in the same way as if he typed the repository name manually again (see: 1.)

- When the app is offline, the user should still be able to see the previously fetched repository information.

4. User can send the selected commits’ data (message, SHA value, author’s name) using 3rd party application installed on the phone (e.g. an e-mail client or Facebook Messenger) in the following way:

- the commits on the list can be selected and unselected,

- user selects at least one commit on the list,

- user taps a “send” button,

- user is asked by the system to choose an application he wants to use for sending a message,

- a new message in the selected app already contains passed commits’ information so that the user does not have to copy-paste it manually.

## Prerequisites

- Node.js installed (version 19.1.0 or higher)
- Expo CLI installed globally (yarn global add expo-cli)

## Installation

1. Clone this repository
2. Navigate to the project directory in the terminal
3. Run yarn install to install all required dependencies

## Available Scripts

```
yarn start
```

Runs the application in development mode.

```
yarn android
```

Runs the application in development mode for Android devices/emulators.

```
yarn ios
```

Runs the application in development mode for iOS devices/simulators.

```
yarn compile
```

Compiles the TypeScript files and reports any errors, but does not emit any files.

```
yarn lint
```

Lints the code using ESLint and TypeScript. Does not emit any files.

```
yarn lint:fix
```

Lints the code using ESLint and TypeScript, fixing any issues that can be fixed automatically. Does not emit any files.

## Test

App was tested on real devices using Expo Go.

1. OnePlus 9 - Android 13
2. Iphone 11 - iOS 16.3.1

## Known Issues

1. Commits sends via Messanger and Signal are cutted

## Example screen

![Simulator Screen Shot - iPhone 14 - 2023-03-16 at 16 38 45](https://user-images.githubusercontent.com/31034370/225723313-3b1451f7-e62b-449c-8da1-0ed9bf47a835.png)

