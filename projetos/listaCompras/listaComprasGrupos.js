const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const bot = new Telegraf(env.token)

let dados = {} // Criar o objeto Dados

const gerarBotoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)), { columns: 3}
    )
)// Vai Criar o Teclado com a lista de itens a partir dos dados digitados

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja Bem Vindo, ${name}`)
    await ctx.reply('Escreva os itens que você deseja adicionar...')
})// Mensagem do comando /start

bot.use((ctx, next) => {
    const chatId = ctx.chat.id // Colocando o id do chat na constante chatId
    if(!dados.hasOwnProperty(chatId)) dados[chatId] = [] // Verifica se tem a propriedade chatId atraves do HASOWNPROPERTY se tiver adiciona ao objeto dados a propriedade chatId e então se torna um ArrayList
    ctx.itens = dados[chatId] // Agora deixa todo o conteudo da Array q acabou de ser criada dentro de itens
    next()
})

bot.on('text', ctx => {
    let texto = ctx.update.message.text 
    if(texto.startsWith('/')) texto = texto.substring(1) // Se o testo começar com / ele captura apartir do primeiro caracter atrasvez de substring lembrando que 0 seria a /
    ctx.itens.push(texto) // Joga o texto digitado para dentro do itens
    ctx.reply(`${texto} adicionado`, gerarBotoes(ctx.itens)) // informa ao usuario que o item foi adicionado e chama novamente os itens
})

bot.action(/delete (.+)/, ctx => {
    const indice = ctx.itens.indexOf(ctx.match[1]) // Coloca na constante exatamente o que esta no Regex atraves do match
    if(indice >= 0) ctx.itens.splice(indice, 1) // Verifica se o indice é maior ou igual a 0 significa que é valido, caso seja valido o primeiro parametro passado para o splice é quem você quer manipular e o segundo é quantos itens quer deletar.
    ctx.reply(`${ctx.match[1]} deletado`, gerarBotoes(ctx.itens)) // Informa ao usuario que o item foi deletado e chama novamente os itens
})

bot.startPolling()