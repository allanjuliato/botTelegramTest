const env = require('../.env')
const Telegraf = require('telegraf')
const Composer = require('telegraf/composer') // Usando Composer
const session = require('telegraf/session')
const Stage = require('telegraf/stage') // Usando Stage
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard') // Usando Wizard

const bot = new Telegraf(env.token)

let descricao = ''// Variavel da descrição da compra
let preco = 0 // Variavel do valor da compra
let data = null // Variavel da Data que informa quando sera pago a compra

const confirmacao = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n')
])) // Função que chama os botões de confirmação

const precoHandler = new Composer() // Instanciando precoHandler
precoHandler.hears(/(\d+)/, ctx => {
    preco = ctx.match[1]
    ctx.reply('É pra pagar que dia?')
    ctx.wizard.next()// Dando next dentro do Wizard
})// Se foi digitado um numero e adiciona a variavel preco

precoHandler.use(ctx => ctx.reply('Apenas números são aceitos...'))// Caso o usuario nao digite um numero

const dataHandler = new Composer() // Instanciando dataHandler
dataHandler.hears(/(\d{2}\/\d{2}\/\d{4})/, ctx => {
    data = ctx.match[1]
    ctx.reply(`Aqui está um resumo da sua compra:
        Descrição: ${descricao}
        Preço: ${preco}
        Data: ${data}
    Confirma?`, confirmacao)
    ctx.wizard.next()
})// Caso a data tenha sido digitado ele informa todas as variavel e chama a função de confirmação dos botoes 

dataHandler.use(ctx => ctx.reply('Entre com uma data no formato DD/MM/YYYY')) // Caso o usario nao digite uma data essa data pode não ser valida 
 
const confirmacaoHandler = new Composer()
confirmacaoHandler.action('s', ctx => {
    ctx.reply('Compra Confirmada!')
    ctx.scene.leave()
})// Função que apenas informa o status da compra atraves da ação que foi tomada no teclado confirmação

confirmacaoHandler.action('n', ctx => {
    ctx.reply('Compra Excluida')
    ctx.scene.leave()
})// Função que apenas informa o status da compra atraves da ação que foi tomada no teclado confirmação

confirmacaoHandler.use(ctx => ctx.reply('Apenas confirme', confirmacao))// Caso o usuario faça qualquer ação q não seja confirmar

// Instanciando a wizard e mostrando ( roteiro ) que ela vai seguir
const wizardCompra = new WizardScene('compra',
    ctx=>{
        ctx.reply('O que você comprou?')
        ctx.wizard.next()
    },
    ctx => {
        descricao = ctx.update.message.text
        ctx.reply('Quanto foi?')
        ctx.wizard.next()
    },
    // Informando a composição da wizard
    precoHandler,
    dataHandler,
    confirmacaoHandler
)

const stage = new Stage([wizardCompra], { default: 'compra'})// Colocando a wizard no stage e informando qual é a wizard padrão 
bot.use(session())
bot.use(stage.middleware())

bot.startPolling()