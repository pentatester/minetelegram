// Cli

const { createMinetelegram, VERSION } = require('./index')
const { ArgumentParser } = require('argparse')

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

const echo = args.echo && args.echo === 'on'
const minetelegramOptions = {
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

const minetelegram = createMinetelegram(minetelegramOptions)

minetelegram.launch()
