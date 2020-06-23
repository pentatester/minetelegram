const { noInstance } = require('./commons')

function equip (ctx) {
  let usage = `
    Usage : /equip <name> <destination> - Equip item from inventory.
    <name> - Item name, example reeds for sugar cane
    <destination> - Equip destination (hand,head,torso,legs,feet,off-hand)
    `
  let bot = ctx.db.getBot()
  if (bot) {
    let message = ctx.message.text || ''
    if (message.length > 7) {
      let args = message.split(' ')
      if (args.length === 3) {
        bot.equipItem(args[1], args[2], equipCb)
      } else {
        bot.equipItem(args[1], null, equipCb)
      }
    } else ctx.reply(usage)
  } else ctx.reply(noInstance)

  function equipCb (err) {
    if (err) {
      ctx.reply(`Error : ${err.message}`)
    } else {
      ctx.reply(`Item equiped`)
    }
  }
}

module.exports = equip
