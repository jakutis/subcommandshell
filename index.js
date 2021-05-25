#!/usr/bin/env node

const readline = require('readline')
const fs = require('fs')
const child_process = require('child_process')

const config = {
  command: process.argv[2],
  shellPath: process.argv[3] || '/bin/sh',
  prefix: process.argv[4] || (process.argv[2] + ' > '),
  default: process.argv[5] || '',
  sigintSuffix: process.argv[6] || '^C',
  historyFilePath: process.argv[7],
}

if (!config.command) {
  console.log("You need to run `subcommandshell <command> <shellPath> <prefix> <default> <sigintSuffix> <historyFilePath>` (all arguments, except the command, are optional), for example: `subcommandshell git /bin/bash 'git > ' status '^C' ~/.gitsh`")
  process.exit(1)
}

const getHistory = () => {
  try {
    return fs.readFileSync(config.historyFilePath).toString().trim().split('\n')
  } catch (err) {
    return []
  }
}

const setHistory = history => {
  try {
    fs.writeFileSync(config.historyFilePath, history.join('\n') + '\n')
  } catch (err) {
  }
}

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  history: getHistory(config.historyFilePath),
  removeHistoryDuplicates: true,
  historySize: 1000000
})

let ignoreInput = false

const ask = () => {
  interface.question(config.prefix, input => {
    if (ignoreInput) {
      ignoreInput = false
      return
    }
    const subcommand = input.trim() || config.default

    try {
      child_process.execSync(config.command + ' ' + subcommand, {
        shell: config.shellPath,
        stdio: [0, 1, 2]
      })
    } catch (err) {
    }
    ask()
  })
}

interface.on('history', history => {
  const acceptedHistory = history.filter(item => !item.endsWith(config.sigintSuffix))
  history.splice.apply(history, [0, history.length].concat(acceptedHistory))
  setHistory(history)
})

interface.on('SIGINT', () => {
  ignoreInput = true
  interface.write(config.sigintSuffix + '\n')
  ask()
})
ask()
