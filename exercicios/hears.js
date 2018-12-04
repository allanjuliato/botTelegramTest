const env = require('../.env')
const Telegraf = require('telegraf')
const moment = require('moment') // Biblioteca para verificar textos especificos

const bot = new Telegraf(env.token)

bot.hears('pizza', ctx => ctx.reply('Quero'))// Apenas a palavra do mesmo jeito que esta escrito exepmlo 'pizza'
bot.hears(['fígado', 'chuchu'], ctx => ctx.reply('Passo!')) // Indentifica um Array com varias palavras, mas novamente no exatamente como ela esta escrita.
bot.hears('😀', ctx => ctx.reply('Belo Sorriso'))// Indentifica Emoji
bot.hears(/burguer/i, ctx => ctx.reply('Quero!')) // Indentificando expressoes regulares o "i" informa que ele vai ignorar se for escrito em maiusculo ou minusculo
bot.hears([/brocolis/i , /salada/i], ctx => ctx.reply['Passo!']) //expressoes regulares dentro de Array
bot.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => { // Nesse exemplo ele esta dentro de um grupo de captura que é representando pelos parentes por isso o match tem que vir informando qual é o primeiro grupo [1]
    moment.locale('pt-BR')
    const data = moment(ctx.match[1], 'DD/MM/YYYY')
    ctx.reply(`${ctx.match[1]} cai em ${data.format('dddd')}`)
})


bot.startPolling()

//Explicando melhor o codigo que ele captura uma data o entre parentes informa que esta dentro de um grupo de captura por isso é necessario usar o match com a localização do grupo.
// Caso retire ele do grupo é possivel usar sem informar qual grupo é necessario capturar