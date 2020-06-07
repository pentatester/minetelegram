# minetelegram

Minecraft - Telegram bridge, build on top of mineflayer &amp; telegraf.

## Features

- Listen mode (Toggleable)

## Usage

```txt
minetelegram [-h] [-v] -t TOKEN -i ID -u USERNAME [-p PASSWORD] [-s SERVER]
                [--port PORT] [-mcv MCVERSION]


Minecraft - Telegram bridge

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -t TOKEN, --token TOKEN
                        telegram bot token from @botfather
  -i ID, --id ID        your telegram user id
  -u USERNAME, --username USERNAME
                        minecraft username / email
  -p PASSWORD, --password PASSWORD
                        minecraft password, only for online-mode=true servers
  -s SERVER, --server SERVER
                        minecraft server address, default : "localhost"
  --port PORT           minecraft server port, default : 25565
  -mcv MCVERSION, --mcversion MCVERSION
                        minecraft version, eg "1.13.2"
```

## Roadmap

- Support inventory
