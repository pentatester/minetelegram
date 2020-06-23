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

module.exports = send
