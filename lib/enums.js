const Enum = require('enum')

const CallbackAction = new Enum({
  True: 1,
  False: 0
})

const CallbackType = new Enum({
  None: 0,
  Bot: 10,
  Settings: 50,
  Inventory: 100,
  Close: 999
})

const CallbackBot = new Enum({
  Quit: 0,
  Connect: 1,
  Reconnect: 2
})

module.exports = {
  CallbackAction,
  CallbackBot,
  CallbackType
}
