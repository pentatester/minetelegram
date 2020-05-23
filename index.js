if (process.argv.length < 3 || process.argv.length > 6) {
  console.log(
    "Usage : node index.js <bot_token> <telegram_id> <mc_username> <mc_password>"
  );
  process.exit(1);
}

const { Telegraf } = require("telegraf");

const { MenuTemplate, MenuMiddleware } = require("telegraf-inline-menu");

const { createBot } = require("mineflayer");

const telegram = new Telegraf(process.argv[2]);

const admin = parseInt(process.argv[3], 10);

const username_ = process.argv[4];
const password_ = process.argv[5];

let bot;
let listen = false;

telegram.use(async (ctx, next) => {
  // middleware
  if (ctx.chat.id === admin) {
    await next();
  }
});

function pm(message) {
  telegram.sendMessage(admin, message);
}

function toggle(mode) {
  if (mode) {
    listen = mode;
  } else {
    listen = !listen;
  }
  if (listen) {
    ctx.reply("Listen mode : ON");
  } else {
    ctx.reply("Listen mode : OFF");
  }
}

telegram.command("toggle", (ctx) => toggle());

telegram.command("connect", (ctx) => {
  if (ctx.message && ctx.message.text.split(" ").length === 3) {
    let con = ctx.message.text.split(" ");
    try {
      let bot = createBot({
        username: username_,
        password: password_,
        host: con[1],
        port: con[2],
      });
      toggle(true);
      bot.on("message", (message) => {
        try {
          if (listen) return pm(message);
        } catch (error) {
          return pm(`Error : ${error.message}`);
        }
      });
      telegram.on("message", (ctx) => {
        try {
          if (bot !== null && listen) return bot.chat(ctx.message.text);
        } catch (error) {
          return pm(`Error : ${error.message}`);
        }
      });
    } catch (error) {
      ctx.reply(`Error : ${error.message}`);
    }
  } else {
    ctx.reply("Usage : /connect <host> <port>");
  }
});

telegram.start((ctx) => ctx.reply("Hi."));
