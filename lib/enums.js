const CallbackAction = {
  True: 1,
  False: 0
}

const CallbackType = {
  None: 0,
  Bot: 10,
  Settings: 50,
  Inventory: 100,
  OpenCurrentWindow: 101,
  CloseCurrentWindow: 103,
  DepositCurrentWindow: 104,
  WithdrawCurrentWindow: 105,
  ItemCurrentWindow: 106,
  CurrentWindow: 110,
  Close: 999
}

const CallbackBot = {
  Quit: 0,
  Connect: 1,
  Reconnect: 2
}

module.exports = {
  CallbackAction,
  CallbackBot,
  CallbackType
}
