const env = require('../.env')
const Telegraf = require('telegraf')
//Axios é uma HTTP Client que é usa pra fazer um requisição HTTP para a API
const axios = require('axios') // Dependencia necessaria para comunidar com a URL para obter os arquivos enviados para o bot.

const bot = new Telegraf(env.token)

// Utilizando o sync para garantir que vamos ter a resposta da API antes de enviar a resposta apara o usuario
bot.on('voice', async ctx => {
    const id = ctx.update.message.voice.file_id // Adiciona o Caminho do id do arquivo a constante id
    const res = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`) // Aqui ele faz a requisição apenas dos Metadados dos arquivos (As Informações do Arquivo incluindo o lugar aonde o arquivo esta)
    ctx.replyWithVoice({ url: `${env.apiFileUrl}/${res.data.result.file_path}`}) // Aqui estamos requisitando o arquvivo atraves da URL e o resultado da linha anterior
    // A explicação de porque usamos res.data.result.file_path é o caminho dentro do metadado ate o file path
})

bot.on('photo', async ctx => {
    const id = ctx.update.message.photo[0].file_id // Adicionamos o Caminho do id da primeira foto(Lembrando toda foto enviada vem em 4 resoluções sendo a primeira com a menor resolução) a constante id
    const res = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`) // Aqui ele faz a requisição apenas dos Metadados dos arquivos (As Informações do Arquivo incluindo o lugar aonde o arquivo esta)
    ctx.replyWithPhoto({ url: `${env.apiFileUrl}/${res.data.result.file_path}`}) // Aqui estamos requisitando o arquvivo atraves da URL e o resultado da linha anterior

})

bot.startPolling() //necessario para startar o Bot