const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5230000945:AAGm1cieNHtX7D5b2yhz10ia2jaJPsZ4vhs'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


bot.setMyCommands([
    {command: '/start', description: 'Начальное приветсвие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Поиграть в Отгадай число'},
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты попробуй угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадай', gameOptions);
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b6d/bc8/b6dbc819-573d-3876-a7f1-36d76d1f1a9f/1.jpg')
            return bot.sendMessage(chatId, `Добро пожаловь в тг бот`);
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понял, попробуй еще разок')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Йу-ху, ты угадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Извини, не угадал. Я загадал: ${chats[chatId]}`, againOptions)
        }
        bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
    })

}

start()