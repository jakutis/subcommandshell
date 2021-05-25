const readline = require('readline')
const child_process = require('child_process')

const config = {
  shell: process.argv[2],
  prefix: process.argv[3],
  command: process.argv[4],
  default: process.argv[5]
}

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  removeHistoryDuplicates: true,
  historySize: 1000000
})

const ask = () => {
  interface.question(config.prefix, input => {
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

interface.on('SIGINT', ask);
interface.pause()
ask()
