const { noInstance } = require('../commons')
const { CallbackType } = require('../enums')
const { callbackData } = require('../utils')

function createSettingsButtons ({
  chatEnabled,
  whisperEnabled,
  messageEnabled
}) {
  return {
    inline_keyboard: [
      [
        {
          text: `Chat ${chatEnabled ? 'ON' : 'OFF'}`,
          callback_data: callbackData(CallbackType.Settings, [0])
        },
        {
          text: `Whisper ${whisperEnabled ? 'ON' : 'OFF'}`,
          callback_data: callbackData(CallbackType.Settings, [1])
        },
        {
          text: `Message ${messageEnabled ? 'ON' : 'OFF'}`,
          callback_data: callbackData(CallbackType.Settings, [2])
        }
      ]
    ]
  }
}

function settings (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    if (ctx.callbackQuery && ctx.callbackQuery.data) {
      let data = ctx.callbackQuery.data
      let args = String(data).split('|')
      switch (parseInt(args[1])) {
        case 0:
          bot.chatEnabled = !bot.chatEnabled
          ctx.answerCbQuery(`Turning `)
          break
        case 1:
          bot.whisperEnabled = !bot.whisperEnabled
          break
        case 2:
          bot.messageEnabled = !bot.messageEnabled
          break
        default:
          break
      }
      // let user = ctx.db.getUser()
      ctx.editMessageReplyMarkup(createSettingsButtons(bot))
    } else {
      ctx.reply('Settings', {
        reply_markup: createSettingsButtons(bot)
      })
    }
  } else ctx.editMessageText(noInstance)
}

module.exports = {
  settings,
  createSettingsButtons
}
