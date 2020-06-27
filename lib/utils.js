function boolOrDefault (n, defaults) {
  return typeof n === 'boolean' ? n : defaults
}

function itemToString (item) {
  if (item) {
    return `S${item.slot}. ${item.displayName} [${item.name}]x${item.count}/${item.stackSize}`
  } else {
    return '(nothing)'
  }
}

function itemsToString (items) {
  if (!items) return 'empty'
  const output = items.map(itemToString).join(', ')
  if (output) {
    return output
  } else {
    return 'empty'
  }
}

function itemByName (items, name) {
  let item
  let i
  for (i = 0; i < items.length; ++i) {
    item = items[i]
    if (item && item.name === name) return item
  }
  return null
}

function windowItemsToString (window) {
  let items = [].concat(window.slots)
  if (items.length === 0) return 'empty'
  return itemsToString(items)
}

module.exports = {
  boolOrDefault,
  itemToString,
  itemsToString,
  itemByName,
  windowItemsToString
}
