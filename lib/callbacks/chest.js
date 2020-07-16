const { CallbackType } = require('../enums')

const { callbackData } = require('../utils')

const {
  openChest,
  closeChest,
  depositChest,
  withdrawChest,
  itemToString
} = require('../commands/chest')

function itemToButton (item) {
  let text = `S${item.slot}. [${item.displayName} x${item.count}]`
  return {
    text,
    callback_data: callbackData(CallbackType.ItemCurrentWindow, [item.slot])
  }
}

function itemsToButtons (items) {}

function itemButton (ctx) {}

module.exports = {
  openChest,
  closeChest,
  itemButton
}
