const VERSION = '0.5.0'
const assert = require('assert')

function inject (bot, token, user, echo = true, ignoreMessages = []) {
  assert.ok(token, new Error('Token not found! pm @botfather to get one'))
  assert.ok(user, new Error('User id not found! pm @myidbot to get one'))
  user = parseInt(user)
  const { Telegraf, Telegram } = require('telegraf')
  const telegram = new Telegraf(token)
  const telegramClient = new Telegram(token)
  let listen = true
  if (user) {
    telegram.use(async (ctx, next) => {
      if (ctx.chat.id === user) {
        await next()
      }
    })
  }

  // Ignored messages
  let ignores = ['/start', '/listen', '/ignore'].concat(ignoreMessages)
  const ignore = msg => ignores.includes(msg)

  // /start command
  telegram.start(ctx =>
    ctx.replyWithHTML(`
    Hi!
    Usage :
    <code>/listen</code> - To toggle listen mode
    <code>/ignore <text></code> - Prevent message to be sent into bot.chat on listen mode, eg <code>/ignore /start</code>
    `)
  )

  // /ignore command - ignore message
  telegram.command('ignore', ctx => {
    const message = ctx.message.text || ''
    const text = message.split(' ')[-1]
    if (ignores.includes(text)) {
      return ctx.reply(`${text} already in ignore list`)
    }
    try {
      ignores.push(text)
    } catch (error) {
      return ctx.reply(`Failed to ignore, reason : ${error.message}`)
    }
    return ctx.reply(`Successfuly added ${text} into ignore list`)
  })

  // /listen command
  telegram.command('listen', ({ reply }) => {
    if (listen) {
      listen = false
      reply('Listen mode disabled')
    } else {
      listen = true
      reply('Listen mode enabled')
    }
  })

  // Telegram -> bot.chat if listen === true
  telegram.on('text', ctx => {
    if (
      listen &&
      ctx.message &&
      ctx.message.text &&
      !ignore(ctx.message.text)
    ) {
      return bot.chat(ctx.message.text)
    }
    if (echo) console.log(`<- ${ctx.message.text}`)
  })

  // Minecraft chat -> telegram
  bot.on('message', message => {
    let length = message && message.length ? message.length() : 0
    if (listen && message && length > 0) {
      telegramClient.sendMessage(user, message.toString())
    }
    if (echo) console.log(`-> ${message.toString() || message}`)
  })

  // Inject into bot object
  bot.telegraf = telegram
  bot.telegram = telegramClient
  bot.sendMessage = text => telegramClient.sendMessage(user, text)
  bot.addToIgnore = text => ignores.push(text)
  telegram.launch()
}

// Check if directly executed?
if (require.main === module) {
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
  const { createBot } = require('mineflayer')
  const bot = createBot(botOptions)
  const echo = args.echo && args.echo === 'on'
  inject(bot, args.token, args.id, echo)
}

module.exports = inject
