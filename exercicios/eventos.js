const env = require('../.env')
const Telegraf = require('telegraf')

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja Bem Vindo, ${name}!`)
})

// O comando REPLY é utlizado em todos os exemplos abaixo para responder ao usuario.
// Usamos o comando CONSOLE.LOG apenas para mostrar no console quais as informações são passadas atraves do console para cada tipo de Evento.

bot.on('text', ctx => 
        ctx.reply(`Texto "${ctx.update.message.text}" recebido com sucesso!` )) // Tratando Evento de Texto, nesse exemplo apenas informamos ao usuario qual foi o texto enviado para o Bot atraves da variavel 'ctx.update.message.text'

bot.on('location', ctx => { // Tratando Evento de Localização, nesse exemplo enviamos a latitude e longitude da localização enviada para o usuario atraves das variaveis 'ctx.update.message.location.latitude' e 'ctx.update.message.location.longitude'                                                   
    const location = ctx.update.message.location
    console.log(location)
    ctx.reply(`Entendido, você esta em.:
    Lat: ${location.latitude},
    Log: ${location.longitude}"`)
})

bot.on('contact', ctx => { // Tratando Evento de Contato, nesse exemplo informamos apenas o primeiro nome e telefone novamente ao usuario atraves das variaveis 'ctx.update.message.contact.first_name' e 'ctx.update.message.contact.phone_number' OBS.: não guardamos esse contato em nenhum momento no bot é apenas uma mensagem
    const contact = ctx.update.message.contact
    console.log(contact)
    ctx.reply(`Vou lembrar do(a) ${contact.first_name}, Tel.:${contact.phone_number}`)
})

bot.on('voice', ctx => { // Tratando Evento de Audio, nesse exemplo informamos ao usuario qual o tamanho do audio atraves da variavel 'ctx.update.message.voice.duration' 
    const voice = ctx.update.message.voice
    console.log(voice)
    ctx.reply(`Audio Recebido, ele possui ${voice.duration} segundos`)
})

bot.on('photo', ctx => { // Tratando Evento de Foto, nesse exemplo usamos o comando forEach pois a foto vem em varios formatos e então informamos ao usuario o tamanho da foto usando as variaveis 'ctx.update.message.photo.width' e 'ctx.update.message.photo.height'
    const photo = ctx.update.message.photo
    console.log(photo)
    photo.forEach((ph, i) => {//ph informa q a foto e o i a posição da no Array
        ctx.reply(`Photo ${i} tem a resolução de ${ph.width}x${ph.height}`)
    });
})

// Todo Sticker tem um emoji diretamente ligado ao significado do Sticker e o nome de seu conjunto
bot.on('sticker', ctx => { // Tratando Evento de Sticker, nesse exemplo informamos qual é o emoji diretamente ligado e qual seu conjunto atraves das variaveis 'ctx.update.message.sticker.emoji' e 'ctx.update.message.sticker.set_name'
    const sticker = ctx.update.message.sticker
    console.log(sticker)
    ctx.reply(`Estou vendo que você enviou o ${sticker.emoji} do conjunto ${sticker.set_name}`)
})
        
bot.startPolling() // Fica Perguntando pra API se existe algo pra ser feito