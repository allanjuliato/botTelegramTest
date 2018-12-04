const env = require('../.env')                      //Chama o arquivo .env
const Telegraf = require('telegraf')                //Chama a biblioteca Telegraf

const bot = new Telegraf(env.token)                 // Iniciando o Bot com o parametro do Token  

bot.start(ctx => {
    const from = ctx.update.message.from            //Aqui informa a mensagem e de quem foi a mensagem
    console.log(from)                               // Apenas um console para mostrar o from
    ctx.reply(`Seja Bem vindo, ${from.first_name}`) // Respondendo a mensagem

})

bot.on('text', async (ctx, next) => {               //Indentifica que foi enviado um Texto e responde e chama o proximo middle
    await ctx.reply('Como você esta?')              // O async e await servem parar só ir para o proximo comando apos o anterior ter sido rodado     
    next()
})

bot.on('text', async ctx => {
    await ctx.reply('O que você precisa?')
})


bot.startPolling()                                  //Fica Perguntando pra API se existe algo pra ser feito

