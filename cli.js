const VERSION = '0.8.0'

const inject = require('./index')

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
parser.addArgument(['-c', '--chat'], {
  defaultValue: 'on',
  choices: ['on', 'off'],
  help: 'Send every chat to telegram, default : on'
})
parser.addArgument(['-w', '--whisper'], {
  defaultValue: 'on',
  choices: ['on', 'off'],
  help: 'Send every whisper to telegram, default : on'
})
parser.addArgument(['-m', '--message'], {
  defaultValue: 'off',
  choices: ['on', 'off'],
  help:
    'Send every message packet to telegram. Turning this on will overide --chat & --whisper to off, default : off'
})
parser.addArgument(['-f', '--filters'], {
  help:
    'Value dilimited by ;, eg. "welcome;bye" this will prevent send to telegram chat message containing welcome or bye'
})
parser.addArgument(['-e', '--echo'], {
  defaultValue: 'on',
  choices: ['on', 'off'],
  help: 'echo everything to console?, default : on'
})

function parseFilters (filters = '') {
  if (filters.includes(';')) return filters.split(';')
  return filters
}

function getBool (prop, defaults) {
  if (prop === 'on') return true
  if (prop === 'off') return false
  return defaults
}

const args = parser.parseArgs()
const botOptions = {
  host: args.server || 'localhost',
  port: args.port || 25565,
  username: args.username,
  password: args.password,
  'online-mode': typeof args.password === 'string',
  version: args.mcversion || false
}

const echo = args.echo && args.echo === 'on'
const telegramOptions = {
  token: args.token,
  user: args.id,
  echo,
  filters:
    typeof args.filters === 'string' && args.filters.length > 0
      ? parseFilters(args.filters)
      : [],
  commands: {},
  chat: getBool(args.chat, true),
  whisper: getBool(args.whisper, true),
  message: getBool(args.message, false)
}

const bot = createBot(botOptions)
inject(bot, telegramOptions)

bot.on('error', err => {
  console.log('Ooops, encountered an error', err)
})
