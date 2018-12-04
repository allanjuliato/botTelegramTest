const env = require('../.env')
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}! 👊`)// Responde em forma de texto puro mas dessa vez com um Emoji
    await ctx.replyWithHTML(`Destacando mensagem <b>HTML</b> <i>de varias</i> <code>formas</code> <pre>possiveis</pre> <a href="http://www.google.com">Google</a>`)// Responde com HTML utilizando replyWithHTML 
    await ctx.replyWithMarkdown('Destacando mensagem *Markdown*' + ' _de várias_ `formas` ```possíveis```' + '[Google](http://www.google.com')// Respondendo com Markdown utilizando replyWithMarkdown
    await ctx.replyWithPhoto({source: `${__dirname}/cat.jpg`})// Responde com uma foto apartir de uma foto salva no diretorio do projeto atraves do comando replyWithPhoto
    await ctx.replyWithPhoto('http://files.cod3r.com.br/curso-bot/gato1.jpg', { caption: 'Olha o Estilo!' })// Responde com uma foto mas dessa vez atraves de um link e o comando caption é usado para mandar uma mensagem junto com a foto
    await ctx.replyWithPhoto({url: 'http://files.cod3r.com.br/curso-bot/gato2.jpg'}) // Respondendo novamente com foto mas agora utlizando o comando url
    await ctx.replyWithLocation(29.9773008, 31.1303068)// Responde com a localização atraves do comando replyWithLocation e passando longitude e latitude
    await ctx.replyWithVideo('http://files.cod3r.com.br/curso-bot/cod3r-end.m4v') // Responde com um video atraves do comando replyWithVideo
})

bot.startPolling()

