function filter (ctx) {
  let usage =
    'Usage : /filter <text> - Filter chat / message prevent sent into telegram\n'
  let bot = ctx.db.getBot()
  if (!bot) return ctx.reply('No instance to add filter to.')
  let message = ctx.message.text || ''
  message = message.replace('/filter', '').trim()
  if (message) {
    if (bot.filters.includes(message)) {
      return ctx.reply(`${message} already in filter list`)
    } else {
      bot.filters.push(message)
      return ctx.reply(`Added ${message} to filtered texts`)
    }
  } else {
    let messageR = `${usage}\nAll filters :`
    messageR += bot.filters.join(', ') || '-'
    return ctx.reply(messageR)
  }
}

module.exports = filter
