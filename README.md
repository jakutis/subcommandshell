# subcommandshell

Spawn a shell to execute subcommands (of, for example, git) without repeating the main command

## Installation

1. install [Node.js](https://nodejs.org/)
2. run `npm install -g subcommandshell`

## Usage

1. run `subcommandshell <command> <shellPath> <prefix> <default> <sigintSuffix> <historyFilePath>` (all arguments, except the command, are optional), for example: `subcommandshell git /bin/bash 'git > ' status '^C' ~/.gitsh`
