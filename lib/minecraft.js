function inject (bot, { user }) {
  // Minecraft -> Filter -> Telegram
  function filterMessage (filters = bot.filters, message = '') {
    if (filters.length > 0) {
      filters.forEach(text => {
        if (typeof text === 'string' && message.includes(text)) return true
      })
    }
    return false
  }

  // Minecraft message -> telegram
  function messageListener (jsonMsg) {
    const message_ = typeof jsonMsg.text === 'string' ? jsonMsg.toString() : ''
    if (
      bot.listen &&
      message_.length > 0 &&
      !filterMessage(bot.filters, message_)
    ) {
      bot.telegram.sendMessage(user, message_, bot.chatExtra)
    }
  }
  bot.on('message', messageListener)

  // Minecraft chat -> telegram
  function chatListener (username, message_, translate, jsonMsg, matches) {
    // get message length
    if (
      bot.listen &&
      !(bot.chatEnabled && !bot.messageEnabled) &&
      typeof message_ === 'string' &&
      message_.length > 0 &&
      !filterMessage(bot.filters, message_)
    ) {
      bot.telegram.sendMessage(user, `${username} > ${message_}`, bot.chatExtra)
    }
    if (bot.echoEnabled) console.log(`-> ${username} > ${message_}`)
  }
  bot.on('chat', chatListener)

  // Minecraft whisper -> telegram
  function whisperListener (username, message_, translate, jsonMsg, matches) {
    if (!(bot.whisperEnabled && !bot.messageEnabled)) {
      bot.telegram.sendMessage(user, `${username} whisper > ${message_}`)
    }
    if (bot.echoEnabled) console.log(`-> ${username} whisper > ${message_}`)
  }
  bot.on('whisper', whisperListener)

  bot.once('spawn', () => {
    return bot.telegram.sendMessage(user, `Spawned ${bot.username}`)
  })
}

module.exports = inject
