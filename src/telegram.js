function inject (
  bot,
  { token, user, echo = true, ignoreMessages = [], commands = {} },
  VERSION
) {
  user = parseInt(user, 10)
  const { Telegraf, Telegram } = require('telegraf')
  const telegram = new Telegraf(token)
  const telegramClient = new Telegram(token)

  const inventory = require('./inventory')
  bot.loadPlugin(inventory)

  let listen = true
  if (user) {
    telegram.use((ctx, next) => {
      if (ctx.chat.id === user) {
        next()
      } else {
        ctx.reply('Unauthorized!')
      }
    })
  }

  telegram.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  })

  // Ignored messages
  let ignoredMessage = ['/start', '/listen', '/ignore'].concat(ignoreMessages)
  const ignore = msg => ignoredMessage.includes(msg)
  const defaulCommands = {
    inventory: ctx => ctx.reply(bot.inventorySayItems()),
    version: ctx => ctx.reply(VERSION)
  }
  commands = Object.assign({}, defaulCommands, commands)
  function registerCommands (commands = {}) {
    if (commands && Object.keys(commands).length > 0) {
      const keys = Object.keys(commands)
      keys.forEach(command => {
        ignoredMessage.push(`/${command}`)
        telegram.command(command, commands[command])
      })
    }
  }

  // /start command
  telegram.start(ctx =>
    ctx.replyWithHTML(`
      Hi!
      Usage :
      <code>/listen</code> - To toggle listen mode
      <code>/ignore text</code> - Prevent message to be sent into bot.chat on listen mode, eg <code>/ignore /start</code>
      <code>/inventory</code> - Show inventory
      `)
  )

  // /ignore command - ignore message
  function ignoreCommand (ctx) {
    const message = ctx.message.text || ''
    const text = message.split(' ')[-1]
    if (ignoredMessage.includes(text)) {
      return ctx.reply(`${text} already in ignore list`)
    }
    try {
      ignoredMessage.push(text)
    } catch (error) {
      return ctx.reply(`Failed to ignore, reason : ${error.message}`)
    }
    return ctx.reply(`Successfuly added ${text} into ignore list`)
  }
  telegram.command('ignore', ignoreCommand)

  // /listen command
  function listenCommand ({ reply }) {
    if (listen) {
      listen = false
      reply('Listen mode disabled')
    } else {
      listen = true
      reply('Listen mode enabled')
    }
  }
  telegram.command('listen', listenCommand)

  registerCommands(commands)

  // Telegram -> bot.chat if listen === true
  function text (ctx) {
    if (
      listen &&
      ctx.message &&
      ctx.message.text &&
      !ignore(ctx.message.text)
    ) {
      bot.chat(ctx.message.text)
    }
    if (echo) {
      if (ignore(ctx.message.text)) {
        console.log(`<- ${ctx.message.text}`)
      } else console.log(`|<- ${ctx.message.text}`)
    }
  }
  telegram.on('text', text)

  // Minecraft chat -> telegram
  function message (message) {
    // get message length
    let length = message && message.length ? message.length() : 0
    if (listen && message && length > 0) {
      telegramClient.sendMessage(user, message.toString())
    }
    if (echo) console.log(`-> ${message.toString() || message}`)
  }
  bot.on('message', message)

  // Inject into bot object
  bot.telegraf = telegram
  bot.telegram = telegramClient
  bot.sendMessage = text => telegramClient.sendMessage(user, text)
  bot.addToIgnore = text => ignoredMessage.push(text)
  bot.once('login', () => telegram.launch())
}

module.exports = inject
