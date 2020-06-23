function boolOrDefault (n, defaults) {
  return typeof n === 'boolean' ? n : defaults
}

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
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

module.exports = { boolOrDefault, itemToString, itemsToString, itemByName }
