const VERSION = '0.6.0'
const assert = require('assert')

function inject (bot, token, user, echo = true, ignoreMessages = []) {
  assert.ok(token, new Error('Token not found! pm @botfather to get one'))
  assert.ok(user, new Error('User id not found! pm @myidbot to get one'))
  user = parseInt(user)
  const inventory = require('./src/inventory')
  bot.loadPlugin(inventory)
  const telegramOptions = {
    token,
    user,
    echo,
    ignoreMessages
  }
  const telegram = require('./src/telegram')
  // register telegram code
  telegram(bot, telegramOptions, VERSION)
}

// Check if directly executed?
if (require.main === module) {
  require('./cli')
}

module.exports = inject
