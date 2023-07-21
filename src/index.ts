import dotenv from 'dotenv';
import { Telegraf, Context } from 'telegraf';
import schedule from 'node-schedule';

import { Message } from 'telegraf/typings/core/types/typegram';

import { getMessageScore, getTale } from './chatgpt';

dotenv.config();
const TOKEN = process.env.CHATGPAT_TOKEN as string;

interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
  match?: string;
}

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN as string);

bot.command('help', (ctx: MyContext) => {
    ctx.reply(`
  Я Виктор Корнеплод! Ответь на любое сообщение в чате с текстом "Корнеплод, кто он?" или "Корнеплод, кто автор?" - 
  Корнеплод расскажет всю правду, написал ли это честный человек РУС или под личиной человеческой ящер подлый прячется.
  Еще я могу рассказать былину, просто обратись ко мне по фамилии моей.
  `);
});

const createPoll = (chatId: number) => {
    const question = 'Как оно?';
    const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    bot.telegram.sendPoll(chatId, question, options, { is_anonymous: false });
};

bot.hears('poll', (ctx: MyContext) => {
    const chatId = ctx.chat?.id;
    createPoll(chatId as number);
});

const job = schedule.scheduleJob('0 14 * * *', () => {
    console.log('Running the background job...');
    const chatId = -1001754687915;
    createPoll(chatId);
});

bot.hears(/(^|\s)рус/ui, (ctx: MyContext) => {
    console.log('hears', ctx?.match);
    ctx.reply('РУС РУС РУС!');
});
bot.hears(/ящер|ящир|((\s|^)жид($|\s))|евре/ui, (ctx) => {
    console.log('hears', ctx?.match);
    ctx.reply('БЛОКИРУЮ! РУС РУС РУС!');
});

bot.hears(/корнеплод/ui, (ctx: MyContext) => {
    console.log('hears', ctx?.match);
    ctx.reply('А?? Корнеплод Виктор звать меня... вот что я скажу тебе:');
    getTale(TOKEN).then(res => {
        ctx.reply(res);
    }).catch(e => {
        console.error('Chat GPT error', e);
        ctx.reply(`Ноль, целковый... ${e.error.message}`);
    });
});

function doReply(ctx: MyContext, response: string) {
    if (Math.random() > 0.5) {
        ctx.reply(response.replace('ЯЩЕР', 'ЯЩИР').replace('РУС', 'РУС!!'));
    } else {
        ctx.reply(response);
    }
}

bot.on('message', (ctx: MyContext) => {
    const message = ctx.message as Message.TextMessage;
    const messageText = message.text;
    const reply = message.reply_to_message as Message.TextMessage;
    const botId = ctx.botInfo.id;
    console.log('message', messageText);
    console.log('userId', ctx?.message?.from?.id);
    const messageId = ctx?.message?.message_id;
    const hui = 336290861;
    //if (ctx?.message?.from?.id == hui) {
    //    ctx.reply(`Ты хуй и пиздабол`, { reply_to_message_id: messageId });
    //    return;
    //}

    if (reply?.from?.id === botId) {
        console.log('Reply to bots message', messageText);
        getMessageScore(messageText as string, TOKEN).then(response => {
            doReply(ctx, response);
        }).catch(e => {
            console.error('Chat GPT error', messageText, e);
            ctx.reply(`Ноль, целковый... ${e.error.message}`);
        });
        return;
    }

    const regexes = [
        /корнеплод,? дай знак!?/iu,
        /корнеплод,? кто/iu,
        /(корнеплод,? )?дай знак!?/iu,
        /(корнеплод,? )?кто он\??/iu,
        /(корнеплод,? )?кто автор\??/iu,
        /(корнеплод,? )?кто он по масти\??/iu

    ];

    if (regexes.some(r => messageText?.match(r)) && message?.reply_to_message) {
        const originalMessage = reply.text || (reply as Message.CaptionableMessage).caption;

        getMessageScore(originalMessage as string, TOKEN).then(response => {
            doReply(ctx, response);
        }).catch(e => {
            console.error('Chat GPT error', originalMessage, e);
            ctx.reply(`Ноль, целковый... ${e.error.message}`);
        });
    }
});


const conf = process.env.prod === 'true' ? {
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN as string,
        port: Number(process.env.PORT) as number,
    },
} : {};

console.log('Launch RUSRUSRUS bot...');
bot.launch(conf);


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
