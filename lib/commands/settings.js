const { noInstance } = require('../commons')
const { createSettingsButtons } = require('../callbacks/settings')

function settings (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    ctx.reply('Settings', {
      reply_markup: createSettingsButtons(bot)
    })
  } else ctx.editMessageText(noInstance)
}

module.exports = settings
