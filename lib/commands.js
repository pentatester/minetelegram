const helpText = `
Hi!
Commands :
/start <username> <server> <version> <password>
/listen - Toggle listen mode
/send <message> - Send message to chat
/inventory - Show current inventory
/select <username> - Select certain minecraft instance
/status - Show status of all minecraft instance
/quit - Quit current instance
/ignore <text> - Prevent message startswith text to be sent into minecraft chat on listen mode
  `

function start (ctx) {
  // /start <username> <server> <version> <password?>
  let message = ctx.message.text || '/start'
  let usage = `
Usage : /start <username> <server> <version> <password>
  username : minecraft username
  server   : server host/ip add port number if using custom port
  version  : server version, eg 1.12.2
  password : minecraft password if online mode enabled
  Example  : /start player1 localhost:3000 1.12.2 thisismypassword
Help? send /help
  `
  let current = ctx.db.getCurrent()
  if (current) return ctx.reply(helpText)
  if (
    typeof message === 'string' &&
    message.length > 7 &&
    message.split(' ').length > 2
  ) {
    let args = message.split(' ')
    let username = args[1]
    let server = args[2]
    let version = args[3] || false
    let password = args[4]
    let host = 'localhost'
    let port = 25565
    if (server.includes(':')) {
      let hostPort = server.split(':')
      host = hostPort[0]
      port = hostPort[1]
    } else {
      host = server
    }
    try {
      let bot = ctx.db.createBot({
        host,
        port,
        'online-mode': typeof args.password === 'string',
        username,
        password,
        version
      })
      ctx.db.setBot(bot)
    } catch (error) {
      ctx.reply(`Error ${error.message}\n${usage}`)
    }
  } else ctx.reply(usage)
}

function listen (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.listen) {
      bot.listen = false
      ctx.reply('Listen mode disabled')
    } else {
      bot.listen = true
      ctx.reply('Listen mode enabled')
    }
  } else ctx.reply('No instance to listen.')
}

function select (ctx) {
  let usage = 'Usage : /select <username>'
  try {
    let username = ctx.message.text.split(' ')[1] || 'Player'
    let bot = ctx.db.getBot()
    if (bot && bot.username === username) return ctx.reply('Already selected!')
    bot = ctx.db.getBot(username)
    if (bot) {
      try {
        ctx.db.setBot(bot)
        ctx.reply(`Selected ${username}`)
      } catch (error) {
        ctx.reply(`Error : ${error.message}`)
      }
    } else ctx.reply('No instance running.')
  } catch (error) {
    ctx.reply(`${error.message}\n${usage}`)
  }
}

function send (ctx) {
  let usage = 'Usage : /send <message> - Send message to chat'
  let bot = ctx.db.getBot()
  let message = ctx.message.text || ''
  if (message.length <= 6) return ctx.reply(usage)
  message = message.replace('/send', '').trim()
  try {
    bot.chat(message)
    bot.telegramSend = true
    bot.telegramSendTime = new Date()
  } catch (error) {
    return ctx.reply(`Error : ${error.message}`)
  }
}

function status (ctx) {
  let status = ctx.db.getStatus()
  ctx.reply(status)
}

function inventory (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    let text = bot.inventorySayItems() || 'No item in inventory'
    ctx.reply(text)
  } else ctx.reply('No instance selected / running.')
}

function ignore (ctx) {
  let usage =
    'Usage : /ignore <text> - Prevent text to be sent into chat on listen mode, eg /ignore /start'
  let message = ctx.message.text || ''
  let ignoredCommands = ctx.db.getIgnoredCommands()
  message = message.split(' ')[1]
  if (message) {
    if (ignoredCommands.includes(message)) {
      return ctx.reply(`${message} already in ignore list`)
    } else {
      ignoredCommands.push(message)
      return ctx.reply(`Added ${message} to ignored commands`)
    }
  } else return ctx.reply(usage)
}

function quit (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    bot.once('end', () => ctx.reply(`${bot.username} disconnected.`))
    bot.quit()
    ctx.db.deleteBot(bot)
  } else ctx.reply('No instance selected / running.')
}

function help (ctx) {
  let message = helpText
  let userCommands = ctx.db.getUserCommans()
  if (userCommands > 1) message.concat(userCommands.join(userCommands))
  return ctx.reply(message)
}

module.exports = {
  start: start,
  listen: listen,
  select: select,
  send: send,
  status: status,
  ignore: ignore,
  inventory: inventory,
  help: help,
  quit: quit
}
