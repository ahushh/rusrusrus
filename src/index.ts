const dotenv = require('dotenv')
dotenv.config();
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.command('quit', async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.hears(/рус/ui, (ctx) => ctx.reply('РУС РУС РУС!'))
bot.hears(/ящер/ui, (ctx) => ctx.reply('БЛОКИРУЮ! РУС РУС РУС!'))

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
