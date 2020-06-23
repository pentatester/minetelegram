function status (ctx) {
  let status = ctx.db.getStatus()
  ctx.reply(status)
}

module.exports = status
