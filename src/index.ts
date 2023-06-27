const dotenv = require('dotenv')
dotenv.config();
import { Telegraf, Context } from 'telegraf';

interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}

const bot = new Telegraf <MyContext>(process.env.BOT_TOKEN as string);

bot.hears(/рус/ui, (ctx) => {
  console.log('hears', ctx.match);
  ctx.reply('РУС РУС РУС!');
})
bot.hears(/ящер/ui, (ctx) => {
  console.log('hears', ctx.match);
  ctx.reply('БЛОКИРУЮ! РУС РУС РУС!');
})


const conf = process.env.prod === 'true' ? {
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN as string,
    port: Number(process.env.PORT) as number,
  },
} : {};

bot.launch(conf);


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
