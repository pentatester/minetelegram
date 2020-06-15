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

  bot.inventorySayItems = sayItems
  bot.itemByName = itemByName
  bot.equipItem = equipItem
}

module.exports = inject
