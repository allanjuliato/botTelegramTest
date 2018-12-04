const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra') // Biblioteca para renderização do teclado
const Markup = require('telegraf/markup') // Biblioteca responsavel por desenhar o teclado

const bot = new Telegraf(env.token)

let contagem = 0 // Contador zerado

// Como funciona o teclado inline, ele aparece aonde esta as mensagens entre usuario e bot, diferente do exemplo "teclado.js" que ele substitui o teclado do usuario.
// No codigo usamos o markup para e a função callbackButton no primeiro parametro mostramos o que vai aparecer para o usuario e o segundo o que sera "Digitado".
const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('+1', 'add 1'), 
    Markup.callbackButton('+10', 'add 10'),
    Markup.callbackButton('+100', 'add 100'),
    Markup.callbackButton('-1', 'sub 1'),
    Markup.callbackButton('-10', 'sub 10'),
    Markup.callbackButton('-100', 'sub 100'),
    Markup.callbackButton('Zerar', 'reset'),
    Markup.callbackButton('Resultado', 'result')
], { columns: 3 })) // Aqui informamos que o teclado ira aparecer em 3 colunas

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo, ${nome}`)
    await ctx.reply(`A contagem atual está em ${contagem}`, botoes) // Aqui Quando usado o comando /start o bot informa seu nome apresenta o contador que deve estar em 0 e então coloca o teclado que foi criado na função botoes
})

bot.action(/add (\d+)/, ctx => { // Usando expressoes regulares capturamos o numeros que vem apos a palavra add
    contagem += parseInt(ctx.match[1]) // Adicionando o valor preciosado ao contador
    ctx.reply(`A Contagem atual está em ${contagem}`, botoes) // Novamente mostramos a contagem e agora ele depende de qual botão foi pressionado pelo usario e chamamos novamente o teclado
})



bot.action(/sub (\d+)/, ctx => {
    contagem -= parseInt(ctx.match[1])
    ctx.reply(`A Contagem atual está em ${contagem}`, botoes)
})

bot.action('reset', ctx => {
    contagem = 0 // Zerando o contador
    ctx.reply(`A contagem atual está em ${contagem}`) // Aqui usamos a palavra exata da ação sem ser necessario usar expressoes regulares
})

bot.action('result', ctx => {
    ctx.answerCbQuery(`A Contagem Atual esta em ${contagem}`) // O comando ANSWERCBQUERY é usado para que o foi passado pra ela apareça na forma de toasty
})

bot.startPolling()