const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let level = 3 // Variavel do level que inicia no 3 ( Centro )

const getLevel = () => {
    let label = ''
    for (let i =1; i <= 5; i++) {
        label += (level === i) ? '||' : '='// Se level for igual ao i do for então ele imprimi || senão ele imprime =
    }
    return label
}

const botoes = () => Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('<<', '<'),
    Markup.callbackButton(getLevel(), 'result'),// Imprime nesse botão o resultado da função
    Markup.callbackButton('>>', '>')
], { columns: 1 })) // Esta em uma coluna para melhor visualização 

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja Bem Vindo, ${name}!`)
    ctx.reply(`Nível: ${level}`, botoes())
})

bot.action('<', ctx => {
    if(level === 1) {
        ctx.answerCbQuery('Chegou no limite')// Se chegar no nivel 1 ele informa atraves de toasty que chegou no limite 
    } else {
        level--
        ctx.editMessageText(`Nível: ${level}`, botoes())// Chamando a mensagem novamente e agora com o editMessage pra que ela fique estatica na ultima posição
    }
})

bot.action('>', ctx => {
    if(level === 5) {
        ctx.answerCbQuery('Chegou no Limite')
    } else {
        level++
        ctx.editMessageText(`Nível: ${level}`, botoes())
    }
})

bot.action('result', ctx => {
    ctx.answerCbQuery(`O Nivel atual está em: ${level}`)
})

bot.startPolling()