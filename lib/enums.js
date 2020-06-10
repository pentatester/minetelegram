const Enum = require('enum')

const CallbackAction = new Enum({
  True: 1,
  False: 0
})

const CallbackType = new Enum({
  None: 0,
  Bots: 10,
  Settings: 50,
  Inventory: 100,
  Close: 999
})

module.exports = {
  CallbackAction,
  CallbackType
}
