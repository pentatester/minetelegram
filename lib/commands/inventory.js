const { noInstance } = require('../commons')

function inventory (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    let text = bot.inventorySayItems() || 'No item in inventory'
    ctx.reply(text)
  } else ctx.reply(noInstance)
}

function useItem (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.heldItem) {
      let item = bot.heldItem && bot.heldItem.name ? bot.heldItem.name : 'item'
      ctx.reply(`Activating ${item}`)
      bot.activateItem()
    } else ctx.reply(`No item held by ${bot.username}.`)
  } else ctx.reply(noInstance)
}

function tossItem (ctx) {
  let usage = `Usage : /toss <name> <amount> - Toss / throw item
  <name> - Item name
  <amount> - Amount of items
  `
  let bot = ctx.db.getBot()
  if (bot) {
    let message = ctx.message.text || ''
    if (bot.inventory.items().length > 0) {
      if (message.length > 6) {
        let args = message.split(' ')
        let msg = usage
        if (args.length === 3) {
          msg = bot.tossItem(args[1], args[2])
        } else if (args.length === 2) {
          msg = bot.tossItem(args[1])
        } else return ctx.reply(usage)
        ctx.reply(msg)
      } else return ctx.reply(usage)
    } else return ctx.reply(`No item in ${bot.username} inventory.`)
  } else return ctx.reply(noInstance)
}

function consume (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.heldItem) {
      let item = bot.heldItem && bot.heldItem.name ? bot.heldItem.name : 'item'
      ctx.reply(`Consumig ${item}`)
      bot.consume(finishConsume)
    } else ctx.reply(`No item held by ${bot.username}.`)
  } else ctx.reply(noInstance)
  function finishConsume (err) {
    if (err) {
      ctx.reply(`Error : ${err.message}`)
    } else ctx.reply(`Eating finished, food point now ${bot.food}`)
  }
}

module.exports = { consume, inventory, tossItem, useItem }
