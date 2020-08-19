function inject (bot, { user }) {
  // Minecraft -> Filter -> Telegram
  function filterMessage (filters = bot.filters, message = '') {
    if (filters.length > 0) {
      filters.forEach(text => {
        if (typeof text === 'string') {
          if (message.includes(text)) return true
          let reText = new RegExp(text)
          if (reText.exec(message)) return true
        }
      })
    }
    return false
  }

  // Minecraft message -> telegram
  function messageListener (jsonMsg) {
    const message_ = typeof jsonMsg.text === 'string' ? jsonMsg.toString() : ''
    if (bot.echoEnabled) console.log(`-> ${message_}`)
    if (
      message_ &&
      bot.listen &&
      bot.messageEnabled &&
      message_.length > 0 &&
      !filterMessage(bot.filters, message_)
    ) {
      bot.telegram
        .sendMessage(user, message_, bot.chatExtra)
        .catch(err => console.error(err))
    } else if (bot.telegramSend) {
      let now = new Date()
      if (now - bot.telegramSendTime < bot.telegramSendDelta) {
        bot.telegram
          .sendMessage(user, message_, bot.chatExtra)
          .catch(err => console.error(err))
      } else {
        bot.telegramSend = false
      }
    }
  }
  bot.on('message', messageListener)

  // Minecraft chat -> telegram
  function chatListener (username, message_, translate, jsonMsg, matches) {
    // get message length
    if (
      message_ &&
      bot.listen &&
      bot.chatEnabled &&
      !bot.messageEnabled &&
      message_.length > 0 &&
      !filterMessage(bot.filters, message_)
    ) {
      bot.telegram
        .sendMessage(user, `${username} > ${message_}`, bot.chatExtra)
        .catch(err => console.error(err))
    }
    // if (bot.echoEnabled) console.log(`-> ${username} > ${message_}`)
  }
  bot.on('chat', chatListener)

  // Minecraft whisper -> telegram
  function whisperListener (username, message_, translate, jsonMsg, matches) {
    if (message_ && bot.whisperEnabled && !bot.messageEnabled) {
      bot.telegram
        .sendMessage(user, `${username} whisper > ${message_}`)
        .catch(err => console.error(err))
    }
    // if (bot.echoEnabled) console.log(`-> ${username} whisper > ${message_}`)
  }
  bot.on('whisper', whisperListener)

  // Minecraft kicked -> telegram
  function kickedListener (reason, loggedIn) {
    let message = reason.text || reason.toString() || ''
    return bot.telegram
      .sendMessage(user, `${bot.username} kicked, reason ${message}`)
      .catch(err => console.error(err))
  }
  bot.on('kicked', kickedListener)
}

module.exports = inject
