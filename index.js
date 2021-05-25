const readline = require('readline')
const fs = require('fs')
const child_process = require('child_process')

const config = {
  command: process.argv[2],
  shell: process.argv[3] || '/bin/sh',
  prefix: process.argv[4] || (process.argv[2] + ' > '),
  default: process.argv[5] || '',
  sigintSuffix: process.argv[6] || '^C',
  history: process.argv[7],
}

const getHistory = () => {
  try {
    return fs.readFileSync(config.history).toString().trim().split('\n')
  } catch (err) {
    return []
  }
}

const setHistory = history => {
  try {
    fs.writeFileSync(config.history, history.join('\n') + '\n')
  } catch (err) {
  }
}

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  history: getHistory(config.history),
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
        shell: config.shell,
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
