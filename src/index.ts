const dotenv = require('dotenv')
dotenv.config();
import { Telegraf, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { getMessageScore, getTale } from './chatgpt';

const TOKEN = process.env.CHATGPAT_TOKEN as string;

interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}

const bot = new Telegraf <MyContext>(process.env.BOT_TOKEN as string);

bot.hears(/(^|\s)рус/ui, (ctx) => {
  console.log('hears', ctx.match);
  ctx.reply('РУС РУС РУС!');
})
bot.hears(/ящер|ящир|((\s|^)жид($|\s))|евре/ui, (ctx) => {
  console.log('hears', ctx.match);
  ctx.reply('БЛОКИРУЮ! РУС РУС РУС!');
})

bot.hears(/корнеплод/ui, (ctx) => {
  console.log('hears', ctx.match);
  ctx.reply('А?? Корнеплод Виктор звать меня... вот что я скажу тебе:');
  getTale(TOKEN).then(res => {
    ctx.reply(res);
  }).catch(e => {
    console.error('Chat GPT error', e);
    ctx.reply(`Ноль, целковый... ${e.error.message}`);
  })
})

bot.on('message', (ctx) => {
  const message = ctx.message as Message.TextMessage;
  const messageText = message.text;

  const regexes = [
    /корнеплод,? дай знак!?/iu,
    /корнеплод,? кто/iu,
    /(корнеплод,? )?дай знак!?/iu,
    /(корнеплод,? )?кто он\??/iu,
    /(корнеплод,? )?кто автор\??/iu,
    /(корнеплод,? )?кто он по масти\??/iu

  ];

  if (regexes.some(r => messageText.match(r)) && message.reply_to_message) {
    const reply = message.reply_to_message as Message.TextMessage;
    const originalMessage = reply.text || (reply as Message.CaptionableMessage).caption;

    getMessageScore(originalMessage as string, TOKEN).then(response => {
      if (Math.random() > 0.5) {
        ctx.reply(response.replace('ЯЩЕР', 'ЯЩИР').replace('РУС', 'РУС!!'));
      } else {
        ctx.reply(response);
      }
    }).catch(e => {
      console.error('Chat GPT error', originalMessage, e);
      ctx.reply(`Ноль, целковый... ${e.error.message}`);
    })
  }
});


const conf = process.env.prod === 'true' ? {
  webhook: {
    domain: process.env.WEBHOOK_DOMAIN as string,
    port: Number(process.env.PORT) as number,
  },
} : {};

console.log('Launch RUSRUSRUS bot...')
bot.launch(conf);


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
