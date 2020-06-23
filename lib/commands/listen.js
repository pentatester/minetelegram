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

module.exports = listen
