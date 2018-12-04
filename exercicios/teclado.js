const env = require('../.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup') // Biblioteca responsavel por desenhar o teclado personalizado

const bot = new Telegraf(env.token)

const tecladoCarne = Markup.keyboard([
    ['🐷Porco', '🐮Vaca', '🐏Carneiro'],    // Linha 1
    ['🐔Galinha', '🐣Eu como é Ovo'],       // Linha 2    
    ['🐟Peixe', '🐙Frutos do Mar'],         // Linha 3
    ['🌵Eu sou Vegetariano']                // Linha 4
// É importante verificar que o teclado suporta colocar emojis
// É criado uma Array cada Array é responsavel por uma linha do teclado
]).resize().extra()//RESIZE serve para ficar do tamanho exato da conversa total e o EXTRA é o responsavel por renderizar o teclado

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}!`)
    await ctx.reply(`Qual bebida você prefere?`, 
        Markup.keyboard(['Coca', 'Pepsi']).resize().oneTime().extra())//O ONETIME serve para que seja apresentando somente uma vez o teclado
})

bot.hears(['Coca', 'Pepsi'], async ctx => {
    await ctx.reply(`Nossa! Eu também gosto de ${ctx.match}`)
    await ctx.reply('Qual sua carne predileta?', tecladoCarne)
}) // Apos apresentar o teclado com as duas opções ele chama o teclado de Carnes

//tratando os resultados dependendo do que foi pressionado no teclado
bot.hears('🐮Vaca', ctx => ctx.reply('A minha predileta também'))
bot.hears('🌵Eu sou Vegetariano', ctx => ctx.reply('Parabens, mas eu ainda gosto de carne'))

bot.on('text', ctx => ctx.reply('Legal!'))

bot.startPolling()