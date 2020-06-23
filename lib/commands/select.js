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

module.exports = select
