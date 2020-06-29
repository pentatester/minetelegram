[![minetelegram](https://repository-images.githubusercontent.com/263459288/9fab6000-b8c8-11ea-918b-6ba219545f7b)](https://github.com/hexatester/minetelegram/)

[![NPM version](https://img.shields.io/npm/v/minetelegram?label=npm%20package)](https://www.npmjs.com/package/minetelegram)
[![NPM version](https://img.shields.io/node/v/minetelegram)](https://www.npmjs.com/package/minetelegram)
[![License](https://img.shields.io/npm/l/minetelegram)](https://github.com/hexatester/minetelegram/blob/master/LICENSE)

[![Deploy to heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hexatester/minetelegram)

Minecraft - Telegram bridge, build on top of mineflayer &amp; telegraf.

## Features

- Listen mode
- Chest interact
- Inventory support

## Roadmap / Upcoming Features

- Auto reconnect
- Multi user support
- Simple navigation
- Pm / Whisper notification

## Commands

```txt
Commands :
/start <username> <server> <version> <password>
/select <username> - Select certain minecraft instance
/status - Show status of all minecraft instance
/helps - Show this message?

Instance commands :
/consume - Consume currently held  item
/equip <name> <destination> - Equip item from inventory
/inventory - Show current inventory
/use_item - Use / activate currently held  item
/toss <name> <amount> - Toss / throw item
/chest - Open chest / curently opened chest

/filter <text> - Filter chat / message, prevent sent to telegram
/listen - Toggle listen mode
/send <message> - Send message to chat
/quit - Quit current instance
```

## Usage

### Heroku

Process

1. Register / Login to heroku.

2. Then press the [![Deploy to heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/hexatester/minetelegram) button.

3. Set app name & choose a region if you want.

4. Then set config vars as folowing
   A var with key `HEROKU` set the value to `YES`.
   A var with key `TOKEN` set the value to your telegram bot token, [Get here](https://t.me/botFather).
   A var with key `USER` set the value to your telegram user id, [Get here](https://t.me/myidbot).
   More on [How to set heroku config vars](https://devcenter.heroku.com/articles/config-vars)

5. After app deployed, then go to manage app.

6. Go to `Resource` tab.

7. Disable web dyno, enable worker dyno.
   Click pencil / edit button of `web npm start` then set tick off (disable), confirm.
   Click pencil / edit button of `worker node heroku.js` then set tick off (enable), confirm.

8. Finally, restart the dynos.
   Click `More` button (top right corner), then `Restart all dynos`, comfirm.

### Standalone

Installation / update:

`npm install -g minetelegram@latest`

Example :

```bash
minetelegram --token BOT_TOKEN --id TELEGRAM_USER_ID --username myusername --server play.myserver.mine --mcversion 1.13.2
```

If you stuck? do `minetelegram --help`

```txt
usage: minetelegram [-h] [-v] -t TOKEN -i ID [-c {on,off}] [-w {on,off}]
                [-m {on,off}] [-f FILTERS] [-e {on,off}]


Minecraft - Telegram bridge

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -t TOKEN, --token TOKEN
                        telegram bot token, created from @botfather
  -i ID, --id ID        your telegram user id, get your id from @myidbot
  -c {on,off}, --chat {on,off}
                        Send every chat to telegram, default : on
  -w {on,off}, --whisper {on,off}
                        Send every whisper to telegram, default : on
  -m {on,off}, --message {on,off}
                        Send every message packet to telegram. Turning this
                        on will overide --chat & --whisper to off, default :
                        off
  -f FILTERS, --filters FILTERS
                        Value dilimited by ;, eg. "welcome;bye" this will
                        prevent send to telegram chat message containing
                        welcome or bye
  -e {on,off}, --echo {on,off}
                        echo everything to console?, default : on
```

### As mineflayer plugin

Installation :

`npm install minetelegram --save`

Example :

```js
const { createMinetelegram } = require('minetelegram')

const minetelegramOptions = {
  token: TOKEN,
  user: USER,
  echo: true,
  filters: [], // default filters for bot
  commands: {}, // default commands? not recomended
  plugins: [], // list of mineflayer your plugins
  chat: true, // send minecraft chat to telegram
  whisper: true, // send minecraft whisper to telegram
  message: false // send all minecraft message to telegram, enabling this will overide chat & whisper to false
}

const minetelegram = createMinetelegram(minetelegramOptions)

// add your default commands here !!!
// minetelegram.addCommand('hi', function, 'test')

// add plugin to use in each instance of bot
function somePlugin (bot) {
  function someFunction() {
    bot.chat('Yay!');
  }
  bot.someFunction = someFunction;
minetelegram.addPlugin(somePlugin)

// to create a bot instance
const bot = minetelegram.createBot({
  host: 'localhost', // optional
  port: 25565, // optional
  username: 'email@example.com', // email and password are required only for
  password: '12345678', // online-mode=true servers
  version: false // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

// add your code for specific bot here before minetelegram.launch()

minetelegram.launch()
```

#### API

##### Telegram

After you register minetelegram using `minetelegram(bot, BOT_TOKEN, TELEGRAM_ID, ECHO)`

You can access [telegraf/Telegraf](https://telegraf.js.org/#/?id=telegraf) from `bot.telegraf`,
also [telegraf/Telegram](https://telegraf.js.org/#/?id=telegram) from `bot.telegram`.

TL;DR
[telegraf/Telegraf](https://telegraf.js.org/#/?id=telegraf) mainly used to listen for events from telegram.
[telegraf/Telegram](https://telegraf.js.org/#/?id=telegram) mainly used to send update / message into telegram.

##### Methods

`bot.addToIgnore(text)` to ignore text / message to be sent when listen mode is enabled
`bot.sendMessage(message)` send text message to telegram.

##### Adding command

Using `Minetelegram.addCommand()` method.

Example

```js
const minetelegram = createMinetelegram(minetelegramOptions)

function sayHi (ctx) {
  // get current & selected minecraft instance
  let bot = ctx.db.getBot()
  return bot.chat('Hi!')
}

minetelegram.addCommand('hi', sayHi, 'Send Hi! to chat')

const bot = minetelegram.createBot({
  host: 'localhost', // optional
  port: 25565, // optional
  username: 'email@example.com', // email and password are required only for
  password: '12345678', // online-mode=true servers
  version: false // false corresponds to auto version detection (that's the default), put for example '1.8.8' if you need a specific version
})

minetelegram.launch()
```
