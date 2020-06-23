const Chest = require('mineflayer/lib/chest')
const Vec3 = require('vec3')
const assert = require('assert')
const { itemsToString, itemByName } = require('../utils')
const { noInstance } = require('./commons')

function prettyStringWindow (window) {
  return `Title  : ${window.title}
  Item Counted : ${itemsToString(window.containerItems())}
  `
}

let afterOpened = `
Chest opened, now you can :
/deposit_chest <amount> <name> - Deposit item(s) into chest
/withdraw_chest <amount> <name> - Withdraw item(s) from chest
/close_chest - Close currently opened container
`

function openChest (ctx) {
  let usage = `Usage :
    /chest <command> - Open chest with command. Example '/endechest', '/vault'
    /chest <x> <y> <z> - Open chest with coord.
    `
  let bot = ctx.db.getBot()
  let Item
  if (bot) {
    Item = require('prismarine-item')(bot.version)
    if (bot.currentWindow) {
      ctx.reply(`
      Current chest\n${prettyStringWindow(bot.currentWindow)}
      `)
    } else {
      let message = ctx.message.text || ''
      let args = message.split(' ')
      // Get open inventory command?
      if (args.length === 2) {
        let command = args[1]
        let chest = openChestCommand(command, Chest)
        chest.on('open', chestOpen)
        chest.on('close', chestClose)
        chest.on('updateSlot', updateSlot)
        bot.currentChest = chest
        setTimeout(windowOpenTimeout, 3 * 1000)
      } else if (args.length === 4) {
        let chestLoc = new Vec3(args[1], args[2], args[3])
        let chestBlock = bot.blockAt(chestLoc)
        try {
          const chest = bot.openChest(chestBlock)
          chest.on('open', chestOpen)
          chest.on('close', chestClose)
          chest.on('updateSlot', updateSlot)
          bot.currentChest = chest
        } catch (error) {
          ctx.reply(`Error : ${error.message}`)
        }
      } else ctx.reply(usage)
    }
  } else ctx.reply(noInstance)
  // Timeout using command
  function windowOpenTimeout () {
    if (!bot.currentWindow) {
      ctx.reply('Error : Timeout waiting for window to open')
    }
  }
  // Events
  function chestClose () {}
  function chestOpen () {
    ctx.reply(afterOpened)
  }
  function updateSlot (oldItem, newItem) {}

  // Chest command implementation
  function openChestCommand (command, Class) {
    const session = new Class()
    session.close = close
    bot.once('windowOpen', onWindowOpen)
    bot.chat(command)
    return session
    function onWindowOpen (window) {
      if (!Class.matchWindowType(window.type)) return
      session.window = window
      bot.once('windowClose', onClose)
      bot.on(`setSlot:${window.id}`, onSetSlot)
      session.emit('open')
    }

    function close () {
      assert.notStrictEqual(session.window, null)
      bot.closeWindow(session.window)
    }

    function onClose () {
      bot.removeListener(`setSlot:${session.window.id}`, onSetSlot)
      session.window = null
      session.emit('close')
    }

    function onSetSlot (oldItem, newItem) {
      if (!Item.equal(oldItem, newItem)) {
        session.emit('updateSlot', oldItem, newItem)
      }
    }
  }
}

// Commands if chest opened?
let noChest = 'No chest opened'

function depositChest (ctx) {
  let usage = 'Usage : /deposit_chest <amount> <name>'
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.currentWindow && bot.currentChest) {
      let message = ctx.message.text || ''
      let args = message.split(' ')
      if (args.length === 3) {
        let amount = parseInt(args[1])
        let name = args[2]
        let chest = bot.currentChest
        const item = itemByName(chest.items(), name)
        if (item) {
          chest.deposit(item.type, null, amount, err => {
            if (err) {
              ctx.reply(`unable to deposit ${amount} ${item.name}`)
            } else {
              ctx.reply(`deposited ${amount} ${item.name}`)
            }
          })
        } else {
          ctx.reply(`unknown item ${name}`)
        }
      } else ctx.reply(usage)
    } else ctx.reply(noChest)
  } else ctx.reply(noInstance)
}

function withdrawChest (ctx) {
  let usage = 'Usage : /withdraw_chest <amount> <name>'
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.currentWindow && bot.currentChest) {
      let message = ctx.message.text || ''
      let args = message.split(' ')
      if (args.length === 3) {
        let amount = args[1]
        let name = args[2]
        let chest = bot.currentChest
        const item = itemByName(chest.items(), name)
        if (item) {
          chest.withdraw(item.type, null, amount, err => {
            if (err) {
              ctx.reply(`unable to withdraw ${amount} ${item.name}`)
            } else {
              ctx.reply(`withdrew ${amount} ${item.name}`)
            }
          })
        } else {
          ctx.reply(`unknown item ${name}`)
        }
      } else ctx.reply(usage)
    } else ctx.reply(noChest)
  } else ctx.reply(noInstance)
}

function closeChest (ctx) {
  let bot = ctx.db.getBot()
  if (bot) {
    if (bot.currentWindow && bot.currentChest) {
      let window = bot.currentWindow
      ctx.reply(`Closing ${window.title}`)
      bot.closeWindow(window)
      bot.currentChest = null
    } else ctx.reply(noChest)
  } else ctx.reply(noInstance)
}

module.exports = { openChest, closeChest, depositChest, withdrawChest }
