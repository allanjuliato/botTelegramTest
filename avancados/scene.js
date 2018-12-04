const env = require('../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage') // Usando Stage
const Scene = require('telegraf/scenes/base') // USando Scene
const { enter, leave } = Stage // Retirando de Stage as funções enter e leave, poderia ser usado também com Stage.enter e Stage.leave

const bot = new Telegraf(env.token)


bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja Bem Vindo, ${name}`)
    ctx.reply('Entre com /echo ou /soma para iniciar...')
})

const echoScene = new Scene('echo') // Estaciando e o parametro é o ID da Scene
echoScene.enter(ctx => ctx.reply('Entrando em Echo Scene'))// Mensagem enviada quando entra na Scene
echoScene.leave(ctx => ctx.reply('Saindo de Echo Scene'))// Mensagem enviada quando saida da Scene
echoScene.command('sair', leave()) // Comando /sair chamando a função leave para sair da Scene
echoScene.on('text', ctx => ctx.reply(ctx.message.text))// Enviado a mensagem enviado de volta ao usario ( Função da Scene por isso se chama echo)
echoScene.on('message', ctx => ctx.reply('Apenas mensagens de texto, por favor'))// Enviando uma mensagem ao usuario caso ele envie qualquer coisa que não seja um texto

let sum = 0 // Variavel zerada para a soma da proxima Scene
const sumScene = new Scene('sum') // Estaciando e o parametro é o ID da Scene
sumScene.enter(ctx => ctx.reply('Entrando em Sum Scene'))// Mensagem enviada quando entra na Scene
sumScene.leave(ctx => ctx.reply('Saindo de Sum Scene'))// Mensagem enviada quando saida da Scene

sumScene.use(async (ctx, next) => { 
    await ctx.reply('Você está em Sum Scene, escreva números para somar...')
    await ctx.reply('Outros comandos: /zerar /sair')
    next()
})// Quando usar a Sum Scene ele ira mostrar essa função

sumScene.command('zerar', ctx =>{
    sum = 0
    ctx.reply(`Valor: ${sum}`)
}) // Comando /zerar faz com que a variavel sum seja tenha o valor igual a 0

sumScene.command('sair', leave()) // Comando /sair chamando a função leave para sair da Scene

sumScene.hears(/(\d+)/, ctx =>{
    sum += parseInt(ctx.match[1])
    ctx.reply(`Valor: ${sum}`)
}) // Quando reconhece que o usuario enviou um numero soma a variavel sum

sumScene.on('message', ctx => ctx.reply('Aprenas números, por favor'))// Caso seja enviado qualquer mensagem que não seja um número

const stage = new Stage([echoScene, sumScene]) // Estanciando o Stage e ele recebe uma Array com as Scenes

bot.use(session()) // É necessario usar a função session para que funcione as Scenes
bot.use(stage.middleware())// É necessario pois ele usa as Scenes como se fossem middlewares
bot.command('soma', enter('sum')) // Usando a função enter com o ID da Scene para entrar na Scene
bot.command('echo', enter('echo')) // Usando a função enter com o ID da Scene para entrar na Scene
bot.on('message', ctx => ctx.reply('Entre com /echo ou /soma para iniciar...'))// Informa o Usuario que o bot só entende os comandos /echo ou /soma

bot.startPolling()// Startando o Bot



