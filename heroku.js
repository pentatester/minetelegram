// How to set config vars
// https://devcenter.heroku.com/articles/config-vars
// then add
// TOKEN = 'telegram bot token, created from @botfather'
// Heroku
// USER = 'your telegram user id, get your id from @myidbot'
let TOKEN = process.env.TOKEN
let USER = process.env.USER

if (!TOKEN) Error('Please set your telegram bot token as TOKEN in config-vars')
if (!USER) Error('Please set your telegram user id as USER in config-vars')

const { createMinetelegram } = require('./index')

const minetelegramOptions = {
  token: TOKEN,
  user: USER,
  echo: true,
  filters: [], // default filters for bot
  commands: {}, // default commands? not recomended
  chat: true, // send minecraft chat to telegram
  whisper: true, // send minecraft whisper to telegram
  message: false // send all minecraft message to telegram, enabling this will overide chat & whisper to false
}

const minetelegram = createMinetelegram(minetelegramOptions)

// add your code here if you wanted to use heroku
// to create a bot instance
// const bot = minetelegram.createBot({
//   host: "localhost", // optional
//   port: 25565,       // optional
//   username: "email@example.com", // email and password are required only for
//   password: "12345678",          // online-mode=true servers
//   version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
// })

minetelegram.launch()
