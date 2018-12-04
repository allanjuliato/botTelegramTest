const env = require('../.env')
const Telegram = require('telegraf/telegram')// Usando Telegram
const axios = require('axios')
const Markup = require('telegraf/markup')

const enviarMensagem = msg => {
    axios.get(`${env.apiUrl}/sendMessage?chat_id=${env.userID}&text=${encodeURI(msg)}`).catch(e => console.log(e))// Chama a função GET e caso der algum problema chama a função CATCH
}

enviarMensagem('Enviando a mensagem de forma assincrona')// Enviando mensagem atraves da URL

/*
setInterval(() =>{
    enviarMensagem('Enviando a mensagem de forma assincrona')
}, 3000) // Enviando Mensagem de 3 em 3 segundos
*/

const teclado = Markup.keyboard([
    ['OK', 'Cancelar']
]).resize().oneTime().extra()// Criando um Teclado 

// Enviando Mensagem atraves da biblioteca telegram
const telegram = new Telegram(env.token)// Instanciando 
telegram.sendMessage(env.userID, 'Essa é uma mensagem com teclado', teclado)// primeiro parametro o ID e depois a mensagem e usamos aqui a função que chama um teclado tbm
