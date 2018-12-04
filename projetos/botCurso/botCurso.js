const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')

const bot = new Telegraf(env.token)

const tecladoOpcoes = Markup.keyboard([
    ['O que são Bots?', 'O que Verei no Curso?'],
    ['Posso mesmo Automtizar Tarefas?'],
    ['Como Comprar o Curso?']
]).resize().extra()// Criando um Teclado personalizado

const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n')
], { collumns: 2 }))// Criando um Teclado Inline


const localizacao = Markup.keyboard([
    Markup.locationRequestButton('Clique Aqui para Enviar sua Localização')
]).resize().oneTime().extra() // Criando um botão para enviar sua Localização

bot.start(async ctx => {
    const nome = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`*Olá, ${nome}!*\nEu Sou o ChatBot do Curso`)
    await ctx.replyWithPhoto('http://files.cod3r.com.br/curso-bot/bot.png')
    await ctx.replyWithMarkdown('_Posso te Ajuda em Algo?_', tecladoOpcoes)
})// Comando /start

bot.hears('O que são Bots?', ctx => {
    ctx.replyWithMarkdown('Bots são blá, blá, blá...\n_Algo mais?_', tecladoOpcoes)
})// Tratando o botão "O que são Bots?"

bot.hears('O que Verei no Curso?', async ctx => {
    await ctx.replyWithMarkdown('No *curso* ... tb vamos criar *3 projetos*:')
    await ctx.reply('1. Um bot que vai gerenciar a sua lista de compras')
    await ctx.reply('2. Um bot que vai te permitir cadastrar seus eventos')
    await ctx.reply('3. E você verá como eu fui feito, isso mesmo, você poderá fazer uma cópia de mim')
    await ctx.replyWithMarkdown('\n\n_Algo mais?_', tecladoOpcoes)   
})// Tratando o botão "O que Verei no Curso?""

bot.hears('Posso mesmo Automtizar Tarefas?', async ctx => {
    await ctx.replyWithMarkdown('Claro que sim, o bot servirá... \nQuer uma palhinha', botoes)
})// Tratando o botão "Posso mesmo Automtizar Tarefas?", Mas dessa vez chamos a função botoes

bot.hears('Como Comprar o Curso?', ctx =>{
    ctx.replyWithMarkdown('Que bom... [link](https://www.cod3r.com.br/)', tecladoOpcoes)
})// Tratando o botão "Como Comprar o Curso?"

bot.action('n', ctx => {
    ctx.reply('Ok, Não Precisa Ser Grosso :(', tecladoOpcoes)
})// Ação do botão Não

bot.action('s', async ctx => {
    await ctx.reply(`Que Legal, tente me enviar sua localização, ou escreva uma mensagem qualquer...`, localizacao)
})// Ação do botão Sim

bot.hears(/mensagem qualquer/i, ctx =>{
    ctx.reply('Essa piada é velha, tenta outra...', tecladoOpcoes)
})// Brincadeira caso a pessoa escreva mensagem qualquer

bot.on('text', async ctx => {
    let msg = ctx.message.text
    msg = msg.split('').reverse().join('')// Usando o .reverse que só pode ser usando em Array pra deixar a mensagem ao contrário e depois o .join pra juntar tudo novamente
    await ctx.reply(`A sua mensagem, ao contrário é.: ${msg}`) 
    await ctx.reply(`Isso mostra que eu consigo ler o que você escreve e processar sua mensagem`, tecladoOpcoes)
})// Deixando a mensagem enviada ao contrário

bot.on('location', async ctx => {
    try {
        const url = 'http://api.openweathermap.org/data/2.5/weather' // API pra pegar a temperatura
        const { latitude: lat, longitude: lon } = ctx.message.location
        const res = await axios.get(`${url}?lat=${lat}&lon=${lon}&APPID=b245e6612fd05a4e8b6e1030a92268a0&units=metric`)// Lembrando que caso nao funcione essa chave é necessario trocar a chave em https://home.openweathermap.org/api_keys
        await ctx.reply(`Hum... Você está em ${res.data.name}`) // Mostrando a localidade
        await ctx.reply(`A Temperatura por ai está em ${res.data.main.temp}ºC`, tecladoOpcoes) // Apresentando a temperatura
    } catch(e) {
        ctx.reply('Estou tendo problemas para pegar a tua localização, Você está no planeta terra? :P', tecladoOpcoes) // Resposta caso dê algum problema com a comunicação com a API
    }
})

bot.startPolling()