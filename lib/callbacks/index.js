const { CallbackType } = require('../enums')
const { settings } = require('./settings')

module.exports = ctx => {
  if (ctx.callbackQuery && ctx.callbackQuery.data) {
    let data = ctx.callbackQuery.data
    let select = parseInt(data.split('|')[0])
    switch (select) {
      case CallbackType.Settings:
        settings(ctx)
        break
      default:
        break
    }
    ctx.answerCbQuery()
  }
}
