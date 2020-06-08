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
  bot.inventorySayItems = sayItems
}

module.exports = inject
