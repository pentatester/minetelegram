const { helpText } = require('./commons')

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
  More commands? /helps
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

module.exports = start
