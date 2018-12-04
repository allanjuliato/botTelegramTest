const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')// A biblioteca que sera usada para fazer a session

const bot = new Telegraf(env.token)

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)), { columns: 3 }// faz um for dentro de uma lista de estrings e transforma em um Array
    )
)// Agora a função botoes aguarda o parametro que no caso é a lista

bot.use(session()) // Usando a sessão

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja Bem Vindo, ${name}!`)
    await ctx.reply('Escreva os itens que você deseja adicionar...')
    ctx.session.lista = [] // Criamos a lista dentro da sessão atual
})

bot.on('text', ctx => {
    let msg = ctx.update.message.text // Cria um objeto que tenha a mensagem digitada
    ctx.session.lista.push(msg) // Utilizando a lista da sessão se faz o push da mensagem digitada na lista.
    ctx.reply(`${msg} adicionado!.`, botoes(ctx.session.lista)) // Enviando a Lista para a função botoes
})

bot.action(/delete (.+)/, ctx => {
    ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista)) // Enviando a Lista para a função botoes
})

bot.startPolling()




