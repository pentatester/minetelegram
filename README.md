# minetelegram

[![NPM version](https://img.shields.io/npm/v/minetelegram?label=npm%20package)](https://www.npmjs.com/package/minetelegram)
[![NPM version](https://img.shields.io/node/v/minetelegram)](https://www.npmjs.com/package/minetelegram)
[![License](https://img.shields.io/npm/l/minetelegram)](https://github.com/hexatester/minetelegram/blob/master/LICENSE)

Minecraft - Telegram bridge, build on top of mineflayer &amp; telegraf.

## Features

- Listen mode (Toggleable)

## Usage

### Standalone

```bash
minetelegram --token BOT_TOKEN --id TELEGRAM_USER_ID --username myusername --server play.myserver.mine --mcversion 1.13.2
```

If you stuck? do `minetelegram --help`

```txt
minetelegram [-h] [-v] -t TOKEN -i ID -u USERNAME [-p PASSWORD] [-s SERVER]
                [--port PORT] [-mcv MCVERSION] [-e {on,off}]


Minecraft - Telegram bridge

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -t TOKEN, --token TOKEN
                        telegram bot token, created from @botfather
  -i ID, --id ID        your telegram user id, get your id from @myidbot
  -u USERNAME, --username USERNAME
                        minecraft username / email
  -p PASSWORD, --password PASSWORD
                        minecraft password, only for online-mode=true servers
  -s SERVER, --server SERVER
                        minecraft server address, default : "localhost"
  --port PORT           minecraft server port, default : 25565
  -mcv MCVERSION, --mcversion MCVERSION
                        minecraft version, eg "1.13.2"
  -e {on,off}, --echo {on,off}
                        echo everything to console?, default : on
```

### As mineflayer plugin

```js
const mineflayer = require("mineflayer");
const bot = mineflayer.createBot({
  host: "localhost", // optional
  port: 25565, // optional
  username: "email@example.com", // email and password are required only for
  password: "12345678", // online-mode=true servers
  version: false, // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
});

const minetelegram = require("minetelegram");
const telegramOptions = {
  token: BOT_TOKEN, // telegram bot token, created from @botfather,
  user: TELEGRAM_ID, // your telegram user id, get your id from @myidbot
  echo: true, // echo everything to console?, default : true
};

minetelegram(bot, telegramOptions);
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

##### Adding commands

You can add new telegram commands, adding object at `commands` key on telegramOptions.

Example

```js
function sayHi() {
  return bot.chat("Hi!");
}

const myCommands = {
  "say_hi": sayHi, // send /say_hi on telegram to check if working
};

const telegramOptions = {
  token: BOT_TOKEN, // telegram bot token, created from @botfather,
  user: TELEGRAM_ID, // your telegram user id, get your id from @myidbot
  echo: true, // echo everything to console?, default : true
  commands: myCommands
};

minetelegram(bot, telegramOptions);
```

## Roadmap

- Support inventory
- Notify on pm
