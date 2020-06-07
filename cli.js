const { VERSION, inject } = require('./index')

const { ArgumentParser } = require('argparse')
const { createBot } = require('mineflayer')

const parser = new ArgumentParser({
  version: VERSION,
  addHelp: true,
  description: 'Minecraft - Telegram bridge'
})
parser.addArgument(['-t', '--token'], {
  help: 'telegram bot token, created from @botfather',
  required: true
})
parser.addArgument(['-i', '--id'], {
  help: 'your telegram user id, get your id from @myidbot',
  required: true
})
parser.addArgument(['-u', '--username'], {
  help: 'minecraft username / email',
  required: true
})
parser.addArgument(['-p', '--password'], {
  help: 'minecraft password, only for online-mode=true servers '
})
parser.addArgument(['-s', '--server'], {
  defaultValue: 'localhost',
  help: 'minecraft server address, default : "localhost"'
})
parser.addArgument(['--port'], {
  defaultValue: 25565,
  help: 'minecraft server port, default : 25565'
})
parser.addArgument(['-mcv', '--mcversion'], {
  help: 'minecraft version, eg "1.13.2"'
})
parser.addArgument(['-e', '--echo'], {
  defaultValue: 'on',
  choices: ['on', 'off'],
  help: 'echo everything to console?, default : on'
})

const args = parser.parseArgs()
const botOptions = {
  host: args.server || 'localhost',
  port: args.port || 25565,
  username: args.username,
  password: args.password,
  'online-mode': typeof args.password === 'string',
  version: args.mcversion || false
}
const bot = createBot(botOptions)
const echo = args.echo && args.echo === 'on'
inject(bot, args.token, args.id, echo)
