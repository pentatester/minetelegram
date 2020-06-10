const VERSION = '0.9.1'

const { Telegraf, Telegram } = require('telegraf')
const { createBot } = require('mineflayer')
const assert = require('assert')
const commands = require('./lib/commands')
const inventory = require('./lib/inventory')
const minecraft = require('./lib/minecraft')

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
      chatEnabled: options.chat || true,
      whisperEnabled: options.whisper || true,
      messageEnabled: options.message || false,
      echoEnabled: options.echo || true,
      chatExtra: {
        disable_web_page_preview: options.disable_web_page_preview || true,
        disable_notification: options.disable_notification || true
      }
    }
    this.overide = true
    this.instances = {}
    this.current = null
    this.ignoredCommands = [
      '/start',
      '/listen',
      '/set',
      '/send',
      '/ignore',
      '/help'
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
    return bot
  }

  getStatus (bot) {
    function status ({ username, health, food, game }) {
      return `
      ${username}
Health    : ${health}
Food      : ${food}
Dimension : ${game.dimension}
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
    assert.strictEqual(
      typeof func,
      'function',
      'func should be as function (telegraf.context as arg)'
    )
    this.commands[name] = command
    this.userCommands.push(`${name} - ${info}`)
  }
}

function createMinetelegram (options = {}) {
  return new Minetelegram(options)
}

module.exports = { createMinetelegram, Minetelegram, VERSION }

if (require.main === module) {
  if ('HEROKU' in process.env && process.env.HEROKU) {
    require('./heroku')
  } else require('./cli')
}
