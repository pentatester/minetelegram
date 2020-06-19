function inject (bot, options) {
  function itemToString (item) {
    if (item) {
      return `${item.displayName} [${item.name}:${item.type}] x ${item.count}`
    } else {
      return '(nothing)'
    }
  }

  function sayItems (items = bot.inventory.items()) {
    const output = items.map(itemToString).join('\n') || 'empty'
    return output
  }

  function itemByName (name) {
    return bot.inventory.items().filter(item => item.name === name)[0]
  }

  function equipItem (name, destination, cb) {
    const item = itemByName(name)
    if (item) {
      bot.equip(item, destination, cb)
    } else {
      cb(new Error(`${bot.username} have no ${name}`))
    }
  }

  function tossItem (name, amount) {
    amount = parseInt(amount, 10)
    const item = itemByName(name)
    if (!item) {
      return `${bot.username} have no ${name}`
    } else if (amount) {
      bot.toss(item.type, null, amount, checkIfTossed)
    } else {
      bot.tossStack(item, checkIfTossed)
    }

    function checkIfTossed (err) {
      if (err) {
        return `${bot.username} unable to toss: ${err.message}`
      } else if (amount) {
        return `${bot.username} tossed ${amount} x ${name}`
      } else {
        return `${bot.username} tossed ${name}`
      }
    }
  }

  bot.inventorySayItems = sayItems
  bot.itemByName = itemByName
  bot.equipItem = equipItem
  bot.tossItem = tossItem
}

module.exports = inject
