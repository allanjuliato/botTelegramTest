const env = require('../.env')
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const nome = ctx.update.message.from.frist_name
    ctx.reply(`Seja bem vindo, ${nome}! \nAvise se precisar de /ajuda`)
})

//O modo correto de criar comando utilizando a comando COMMAND
//No comando COMMAND não é necessario colocar o / pois ele ja entende que é um comando e é necessario o /
bot.command('ajuda', ctx => ctx.reply('/Ajuda: vou mostrar as opções'
    +'\n/ajuda2: para testar via hears'
    +'\n/op2: Opção Generica'
    +'\n/op3: Outra opção genérica.qualquer'))
//Mas vemos que é possivel criar comandos com o hears e escutando a opção como no exemplo a baixo que escuta o /ajuda2
bot.hears('/ajuda2', ctx => ctx.reply('Eu também consigo capturar comandos'
    + ', mas utilize a /ajuda mesmo'))

//Coloque \d+ se quiser colocar /op+ um numero ou mais    
//bot.hears(/\/op\d+/i, ctx => ctx.reply('Resposta padrão para comandos genéricos'))
bot.hears(/\/op(2|3)/i, ctx => ctx.reply('Resposta padrão para comandos genéricos')) //Colocamos (2|3) para apresentar que só existe duas opções

bot.startPolling()