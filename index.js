const VERSION = '3.0.0'

const { Telegraf, Telegram } = require('telegraf')
const { createBot } = require('mineflayer')
const assert = require('assert')
const commands = require('./lib/commands/index')
const callbacks = require('./lib/callbacks/index')
const inventory = require('./lib/inventory')
const minecraft = require('./lib/minecraft')
const { boolOrDefault } = require('./lib/utils')

class Minetelegram {
  constructor (options = {}) {
    assert.notEqual(
      options.token,
      undefined,
      new Error('Token not found! pm @botfather to get one')
    )
    assert.notEqual(
      options.user,
      undefined,
      new Error('User id not found! pm @myidbot to get one')
    )
    this.token = options.token
    this.user = parseInt(options.user, 10)
    this.commands = Object.assign({}, commands, options.commands)
    let plugins = [inventory].concat(options.plugins)
    this.plugins = plugins.filter(plugin => typeof plugin === 'function')
    this.defaults = {
      filters: options.filters || [],
      chatEnabled: boolOrDefault(options.chat, true),
      whisperEnabled: boolOrDefault(options.whisper, true),
      messageEnabled: boolOrDefault(options.message, false),
      echoEnabled: boolOrDefault(options.echo, true),
      chatExtra: {
        disable_web_page_preview: boolOrDefault(
          options.disable_web_page_preview,
          true
        ),
        disable_notification: boolOrDefault(options.disable_notification, true)
      },
      telegramSendDelta: 1000
    }
    this.overide = true
    this.instances = {}
    this.botOptions = {}
    this.current = null
    this.ignoredCommands = [
      '/start',
      '/listen',
      '/select',
      '/send',
      '/status',
      '/filter',
      '/inventory',
      '/equip',
      '/consume',
      '/use_item',
      '/toss',
      '/chest',
      '/close_chest',
      '/deposit_chest',
      '/withdraw_chest',
      '/helps',
      '/quit'
    ]
    this.userCommands = ['User commands :']
    const telegraf = new Telegraf(this.token)
    const telegram = new Telegram(this.token)
    telegraf.context.db = {
      getClient: () => {
        return telegram
      },
      getBot: username => {
        if (username) return this.instances[username]
        return this.bot
      },
      setBot: bot => {
        this.bot = bot
      },
      createBot: options => {
        return this.createBot(options)
      },
      deleteBot: bot => {
        if (this.instances.hasOwnProperty(bot.username)) {
          return delete this.instances[bot.username]
        }
      },
      getIgnoredCommands: () => {
        return this.ignoredCommands
      },
      getUserCommans: () => {
        return this.userCommands
      },
      getStatus: bot => {
        return this.getStatus(bot)
      },
      getCurrent: () => {
        return this.current
      },
      getBotOptions: username => {
        if (username && username in this.botOptions) {
          return this.botOptions[username]
        }
      },
      getUser: () => {
        return this.user
      }
    }
    this.telegraf = telegraf
    this.telegram = telegram
    this.VERSION = VERSION
  }

  launch () {
    this.telegraf.use((ctx, next) => {
      if (ctx.chat.id === this.user) {
        next()
      } else {
        ctx.reply('Unauthorized!')
      }
    })
    for (var command in this.commands) {
      this.telegraf.command(command, this.commands[command])
    }
    this.telegraf.on('callback_query', callbacks)
    this.telegraf.on('text', this.textFilter)
    this.telegraf.launch()
  }

  get bot () {
    if (Object.keys(this.instances).includes(this.current)) {
      return this.instances[this.current]
    }
    // this.telegram.sendMessage(this.user, 'No instance running')
  }

  set bot (bot) {
    let prevBot = this.bot
    if (prevBot) prevBot.listen = false
    this.current = bot.username
    bot.listen = true
    this.instances[this.current] = bot
  }

  createBot (options) {
    const bot = createBot(options)
    Object.assign(bot, this.defaults)
    bot.telegraf = this.telegraf
    bot.telegram = this.telegram
    bot.listen = false
    bot.ignoredCommands = this.ignoredCommands
    bot.loadPlugins(this.plugins)
    minecraft(bot, {
      user: this.user
    })
    if (this.overide) this.bot = bot
    bot.once('login', () => {
      bot.lastLoggedIn = new Date()
      return bot.telegram.sendMessage(this.user, `Logged in ${bot.username}`)
    })
    return bot
  }

  getStatus (bot) {
    function status ({ username, health, food, game }) {
      return `
      ${username}
Health    : ${health || '-'}
Food      : ${food || '-'}
Dimension : ${game ? game.dimension : '-'}
      `
    }
    if (bot) return status(bot)
    if (Object.keys(this.instances).length === 0) {
      return 'No minecraft instance running.'
    }
    let status_ = []
    for (var username in this.instances) {
      status_.push(status(this.instances[username]))
    }
    return status_.join('\n\n')
  }

  textFilter (ctx) {
    let bot = ctx.db.getBot()
    let ignoredCommands = ctx.db.getIgnoredCommands()
    function ignore (message) {
      for (var ignoreM in ignoredCommands) {
        if (message.startsWith(ignoreM)) return true
      }
      return false
    }
    if (!bot) return
    if (
      bot.listen &&
      ctx.message &&
      ctx.message.text &&
      !ignore(ctx.message.text)
    ) {
      bot.chat(ctx.message.text)
    }
    if (bot.echoEnabled) {
      console.log(`<- ${ctx.message.text}`)
    }
  }

  addPlugin (plugin) {
    return this.plugins.push(plugin)
  }

  addCommand (name, command, info = 'no info') {
    if (typeof name !== 'string') {
      return Error('name should be a string (telegraf.context as arg)')
    }
    if (typeof command !== 'function') {
      return Error('command should be a function (telegraf.context as arg)')
    }
    this.commands[name] = command
    this.userCommands.push(`${name} - ${info}`)
  }
}

function createMinetelegram (options = {}) {
  return new Minetelegram(options)
}

module.exports = { createMinetelegram, Minetelegram, VERSION }

if (require.main === module) {
  if ('TOKEN' in process.env && 'USER' in process.env) {
    require('./heroku')
  } else require('./cli')
}
