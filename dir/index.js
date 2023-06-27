"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv');
dotenv();
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
bot.command('quit', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit usage
    yield ctx.telegram.leaveChat(ctx.message.chat.id);
    // Using context shortcut
    yield ctx.leaveChat();
}));
bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit usage
    yield ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
    // Using context shortcut
    yield ctx.reply(`Hello ${ctx.state.role}`);
}));
bot.on('callback_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    // Explicit usage
    yield ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
    // Using context shortcut
    yield ctx.answerCbQuery();
}));
bot.on('inline_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const result = [];
    // Explicit usage
    yield ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
    // Using context shortcut
    yield ctx.answerInlineQuery(result);
}));
bot.launch();
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
