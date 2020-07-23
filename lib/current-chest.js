const Chest = require('mineflayer/lib/chest')
const Vec3 = require('vec3')
const assert = require('assert')
const { noInstance } = require('./commons')

class CurrentChest {
  constructor (options = {}) {
    this.user = options.user
    this.bot = options.bot
    this.telegraf = options.telegraf
    this.telegram = options.telegram
    this.session = 0
    this.messageId = null
    this.inlineMessageId = null
  }

  setChest (chest, window) {
    this.chest = chest
    this.window = window
    this.session += 1

    chest.on('open', this.chestOpen)
    chest.on('updateSlot', this.updateSlot)
    chest.once('close', this.chestClose)
  }

  getButtons (withdraw = false, deposit = false) {
    if (!this.chest || !this.chest.window) return
    let inventoryStart = window.inventoryStart
    let inventoryEnd = window.inventoryEnd
    let buttons = []
    let topWindow = []
    let bottomWindow = []
    for (let [slot, item] of this.chest.window.slots) {
      if (!item) continue
      if (slot < inventoryStart) {
        topWindow.push(item)
      } else if (slot >= inventoryStart && slot <= inventoryEnd) {
        bottomWindow.push(item)
      }
    }
    function createButtons (items = []) {
      let buttonsC = []
      let row = 0
    }
    function createSeparator () {
      return
    }
    return
  }

  deposit (slot, cb = this.updateSlot()) {
    let item = this.getSlot(slot)
    if (item) {
    }
  }

  withdraw (slot, cb = this.updateSlot()) {
    let item = this.getSlot(slot)
    if (item) {
    }
  }

  getSlot (slot) {
    if (!this.chest || !this.chest.window) return
    return this.chest.window.slots[parseInt(slot)]
  }

  chestOpen () {}
  chestClose () {
    this.chest.removeListener('open', this.chestOpen)
    this.chest.removeListener('updateSlot', this.updateSlot)
    // this.chest.removeListener('close', this.chestClose)
  }

  updateSlot (oldItem, newItem) {
    try {
      this.telegram.editMessageReplyMarkup(
        this.user,
        this.messageId,
        this.inlineMessageId,
        this.getButtons()
      )
    } catch (error) {
      console.error(error)
    }
  }

  openChest (ctx) {
    let usage = `Usage :
      /chest <command> - Open chest with command. Example '/endechest', '/vault'
      /chest <x> <y> <z> - Open chest with coord.
      `
    let bot = ctx.db.getBot()
    if (bot) {
      if (this.window) {
        ctx.reply(
          `
        Current chest\n${this.window.title}
        `,
          {
            inline_keyboard: this.getButtons()
          }
        )
      } else {
        let message = ctx.message.text || ''
        let args = message.split(' ')
        // Get open inventory command?
        if (args.length === 2) {
          let command = args[1]
          let chest = this.openChestOrCommand(command, Chest)
          chest.on('open', this.chestOpen)
          chest.on('close', this.chestClose)
          chest.on('updateSlot', this.updateSlot)
          bot.currentChest = chest
          setTimeout(windowOpenTimeout, 3 * 1000)
        } else if (args.length === 4) {
          let chestLoc = new Vec3(args[1], args[2], args[3])
          let chestBlock = bot.blockAt(chestLoc)
          try {
            const chest = this.openChestOrCommand(chestBlock, Chest)
            chest.on('open', this.chestOpen)
            chest.on('close', this.chestClose)
            chest.on('updateSlot', this.updateSlot)
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
  }

  // Chest command implementation
  openChestOrCommand (command, Class) {
    let Item = require('prismarine-item')(this.bot.version)
    const session = new Class()
    session.close = close
    this.bot.once('windowOpen', onWindowOpen)
    if (typeof command === 'string') {
      this.bot.chat(command)
    } else {
      this.bot.activateBlock(command)
    }
    return session
    function onWindowOpen (window) {
      if (!Class.matchWindowType(window.type)) return
      session.window = window
      this.bot.once('windowClose', onClose)
      this.bot.on(`setSlot:${window.id}`, onSetSlot)
      session.emit('open')
    }

    function close () {
      assert.notStrictEqual(session.window, null)
      this.bot.closeWindow(session.window)
    }

    function onClose () {
      this.bot.removeListener(`setSlot:${session.window.id}`, onSetSlot)
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

module.exports = CurrentChest
