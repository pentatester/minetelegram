const { noInstance } = require('./commons')

function quit (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    bot.once('end', () => ctx.reply(`${bot.username} disconnected.`))
    bot.quit()
    ctx.db.deleteBot(bot)
  } else ctx.reply(noInstance)
}

module.exports = quit
