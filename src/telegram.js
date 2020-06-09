function inject (
  bot,
  {
    token,
    user,
    echo = true,
    filters = [],
    commands = {},
    chat = true,
    whisper = true,
    message = false
  },
  VERSION
) {
  user = parseInt(user, 10)
  const { Telegraf, Telegram } = require('telegraf')
  const telegram = new Telegraf(token)
  const telegramClient = new Telegram(token)

  const inventory = require('./inventory')
  bot.loadPlugin(inventory)
  let chatExtra = {
    disable_web_page_preview: true,
    disable_notification: true
  }

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
  let ignoredCommands = ['/start', '/listen', '/ignore', '/send']
  const ignore = msg => {
    ignoredCommands.forEach(ignoreM => {
      if (msg.startsWith(ignoreM)) return true
    })
    return false
  }
  const defaulCommands = {
    inventory: ctx => ctx.reply(bot.inventorySayItems()),
    version: ctx => ctx.reply(VERSION)
  }
  commands = Object.assign({}, defaulCommands, commands)
  function registerCommands (commands = {}) {
    if (commands && Object.keys(commands).length > 0) {
      const keys = Object.keys(commands)
      keys.forEach(command => {
        ignoredCommands.push(`/${command}`)
        telegram.command(command, commands[command])
      })
    }
  }

  // Minecraft -> Filter -> Telegram
  function filterMessage (message = '') {
    if (filters.length > 0) {
      filters.forEach(text => {
        if (typeof text === 'string' && message.includes(text)) return true
      })
    }
    return false
  }

  // /start command
  telegram.start(ctx =>
    ctx.replyWithMarkdown(`
      Hi!
      Usage :
      /ignore <text> - Prevent text to be sent into chat on listen mode, eg /ignore /start
      /inventory - Show current inventory
      /listen - To toggle listen mode
      /send <message> - Send message to chat
      `)
  )

  // /send
  function sendCommand (ctx) {
    let message = ctx.message.text || ''
    if (message.length <= 6) return ctx.reply('Usage : /send <message>')
    message = message.replace('/send', '').trim()
    try {
      bot.chat(message)
    } catch (error) {
      ctx.reply(`Ooops, encountered an error for ${ctx.updateType}`, error)
    }
  }
  telegram.command('send', sendCommand)

  // /ignore command - ignore message (Telegram -> /command -> !ignoreCommand -> Minecraft)
  function ignoreCommand (ctx) {
    try {
      const message = ctx.message.text || ''
      const text = message.split(' ')[-1]
      if (ignoredCommands.includes(text)) {
        return ctx.reply(`${text} already in ignore list`)
      }
      ignoredCommands.push(text)
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

  // Minecraft message -> telegram
  function messageListener (jsonMsg) {
    const message_ = typeof jsonMsg.text === 'string' ? jsonMsg.toString() : ''
    if (listen && message_.length > 0 && !filterMessage(message_)) {
      telegramClient.sendMessage(user, message_, chatExtra)
    }
  }
  if (message) bot.on('message', messageListener)

  // Minecraft chat -> telegram
  function chatListener (username, message_, translate, jsonMsg, matches) {
    // get message length
    if (
      listen &&
      typeof message_ === 'string' &&
      message_.length > 0 &&
      !filterMessage(message_)
    ) {
      telegramClient.sendMessage(user, `${username} > ${message_}`, chatExtra)
    }
    if (echo) console.log(`-> ${username} > ${message_}`)
  }
  if (chat && !message) bot.on('chat', chatListener)

  // Minecraft whisper -> telegram
  function whisperListener (username, message_, translate, jsonMsg, matches) {
    telegramClient.sendMessage(user, `${username} whisper > ${message_}`)
    if (echo) console.log(`-> ${username} whisper > ${message_}`)
  }

  if (whisper && !message) bot.on('whisper', whisperListener)

  // Inject into bot object
  bot.telegraf = telegram
  bot.telegram = telegramClient
  bot.sendMessage = text => telegramClient.sendMessage(user, text)
  bot.addToIgnore = text => ignoredCommands.push(text)
  bot.once('login', () => telegram.launch())
}

module.exports = inject
