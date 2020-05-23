if (process.argv.length < 3 || process.argv.length > 6) {
  console.log(
    "Usage : node fisherman.js <bot_token> <telegram_id> <mc_username> <mc_password>"
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

telegram.use(async (ctx, next) => {
  // middleware
  if (ctx.chat.id === admin) {
    await next();
  }
});

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
    } catch (error) {
      ctx.reply(`Error : ${error.message}`);
    }
  } else {
    ctx.reply("Usage : /connect <host> <port>");
  }
});

telegram.start((ctx) => ctx.reply("Hi."));
