const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let lista = []

const botoes = () => Extra.markup(
    Markup.inlineKeyboard(
      lista.map(item => Markup.callbackButton(item, `delete ${item}`)),// A função map ela converte uma lista strings em uma lista de callbackbuttons
      { columns: 3 }  // Separando os itens em colunas de 3 itens
    )
)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja Bem Vindo, ${name}!`)
    await ctx.reply('Escreva os itens que você deseja adicionar...')
})

bot.on('text', ctx => {
    lista.push(ctx.update.message.text)//Adiciona o texto a lista
    ctx.reply(`${ctx.update.message.text} adicionado`, botoes())// Nesse exemplo botoes é uma função, pois ele precisa colocar o item dentro da lista antes de apresentar
})

bot.action(/delete (.+)/, ctx =>{ // Regex para indentificar o item q sera deletado
    lista = lista.filter(item => item !== ctx.match[1])// Filtra a lista apresentando apenas os itens diferentes do item selecionado
    ctx.reply(`${ctx.match[1]} deletado!`, botoes())// Informa o usuario que o item foi deletado
})

bot.startPolling()