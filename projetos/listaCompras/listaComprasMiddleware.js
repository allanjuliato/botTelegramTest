const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')

const bot = new Telegraf(env.token)

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)), { columns: 3 }
    )
)

bot.use(session())

const verificarUsuario = (ctx, next) => {
    const mesmoID = ctx.update.message && ctx.update.message.from.id === env.userID // Verificando se existe uma mensagem e se é o id da mensagem é igual ao autorizado no .env
    const mesmoIDCallback = ctx.update.callback_query && ctx.update.callback_query.from.id === env.userID // Verifica se existe um callback e se o id do callback é igual ao id autorizado no .env

    if (mesmoID || mesmoIDCallback) {
        next()
    } else {
        ctx.reply('Desculpe, não fui autorizado a conversar com você.')
    }
}

// Apenas para ter mais de um middleware
const processando = ({ reply }, next) => reply('processando...').then(() => next())

bot.start(verificarUsuario, async ctx => { // Para Adicionar a middle de segurança que verifica se é um usuario permitido é necessario apenas colocar ele antes da função
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja Bem Vindo, ${name}!`)
    await ctx.reply('Escreva os itens que você deseja adicionar...')
    ctx.session.lista = [] // Criamos a lista dentro da sessão atual
})

bot.on('text', verificarUsuario, processando, ctx => {
    let msg = ctx.update.message.text // Cria um objeto que tenha a mensagem digitada
    ctx.session.lista.push(msg) // Utilizando a lista da sessão se faz o push da mensagem digitada na lista.
    ctx.reply(`${msg} adicionado!.`, botoes(ctx.session.lista)) // Enviando a Lista para a função botoes
})

bot.action(/delete (.+)/, verificarUsuario, ctx => {
    ctx.session.lista = ctx.session.lista.filter(item => item !== ctx.match[1])
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.session.lista)) // Enviando a Lista para a função botoes
})

bot.startPolling()
