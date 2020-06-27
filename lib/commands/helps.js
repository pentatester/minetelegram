const { helpText } = require('./commons')

function helps (ctx) {
  let message = helpText
  let userCommands = ctx.db.getUserCommans()
  if (userCommands > 1) {
    message.concat(userCommands.join(userCommands))
  }
  return ctx.reply(message)
}

module.exports = helps
