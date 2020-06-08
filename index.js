const VERSION = '0.7.1'
const assert = require('assert')

function inject (bot, telegramOptions) {
  const { token, user } = telegramOptions
  assert.ok(token, new Error('Token not found! pm @botfather to get one'))
  assert.ok(user, new Error('User id not found! pm @myidbot to get one'))
  const telegram = require('./src/telegram')
  // register telegram code
  telegram(bot, telegramOptions, VERSION)
}

// Check if directly executed?
if (require.main === module) {
  require('./cli')
}

module.exports = inject
