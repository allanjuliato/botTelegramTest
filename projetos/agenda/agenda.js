const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const { 
    getAgenda,
    getTarefa,
    getTarefas,
    getConcluidas,
    incluirTarefa,
    concluirTarefa,
    excluirTarefa,
    atualizarDataTarefa,
    atualizarObsTarefa
 } = require('./agendaServicos')// Importando funções do agendaServicos

const bot = new Telegraf(env.token)

bot.start(ctx => {
    const nome = ctx.update.message.from.first_name
    ctx.reply(`Seja bem Vindo, ${nome}`)
})// Start Padrão

// Função para formatar a data para o formato Brasileiro, pois o json deixa em formato americano
const formatarData = data => data ? moment(data).format('DD-MM-YYYY') : '' // Caso venha uma data ele deixa no formato DD/MM/YYYY e caso não sjea ele deixa vazio

//Função para exibir a tarefa
const exibirTarefa = async (ctx, tarefaId, novaMsg = false) => {
    const tarefa = await getTarefa(tarefaId)
    const conclusao = tarefa.dt_conclusao ? `\n<b>Concluida em:</b> ${formatarData(tarefa.dt_conclusao)}` : ''
    const msg = `
        <b>${tarefa.descricao}</b>
        <b>Previsão:</b> ${formatarData(tarefa.dt_previsao)}${conclusao}
        <b>Observações:</b>\n${tarefa.observacao || ''}
    `// Mensagem enviada o ao usuario
     // Em Previsão é passado o conclusão caso já esteja concluida ele chama a constante conclusão e exite o dia que foi concluida

     //Caso seja uma nova mensagem ele usa o reply senao o editMessageText
    if(novaMsg) {
        ctx.reply(msg, botoesTarefa(tarefaId))
    }else{
        ctx.editMessageText(msg, botoesTarefa(tarefaId))
    }
}

// Função que transforma as tarefas em botoes
const botoesAgenda = tarefas => {
    const botoes = tarefas.map(item => {
        const data = item.dt_previsao ? `${moment(item.dt_previsao).format('DD-MM-YYYY')} - ` : ''
        return (Markup.callbackButton(`${data}${item.descricao}`, `mostrar ${item.id}`))
    })
    return Extra.markup(Markup.inlineKeyboard(botoes, { columns: 1 }))
}

// Botoes de ação das tarefas ele é usado quando se clica em uma tarefa e usando na função exibirTarefa
const botoesTarefa = idTarefa => Extra.HTML().markup(Markup.inlineKeyboard([// É usando o .HTML() para que a formatão HTML usada acima seja utilizada caso contrario não seria usado
    Markup.callbackButton('✔️', `concluir ${idTarefa}`),
    Markup.callbackButton('📅', `setData ${idTarefa}`),
    Markup.callbackButton('💬', `addNota ${idTarefa}`),
    Markup.callbackButton('✖️', `excluir ${idTarefa}`)
], { columns: 4 }))

// Comando dia que apresenta as tarefas do dia e as pendentes
bot.command('dia', async ctx => {
    const tarefas = await getAgenda(moment()) // Quando se usa o moment sem passar parametros ele retorna a data atual
    ctx.reply(`Aqui esta a sua agenda do dia`, botoesAgenda(tarefas)) // Aqui passa as tarefas pro botoesAgenda e ai ele cria os itens com as tarefas
})

// Comando que apresenta as tarefas de amanha e as pendentes
bot.command('amanha', async ctx => {
    const tarefas = await getAgenda(moment().add({ day: 1 }))
    ctx.reply(`Aqui sua agenda até amanha`, botoesAgenda(tarefas))
})

// Comando que apresenta as tarefas da semana e as pendentes
bot.command('semana', async ctx => {
    const tarefas = await getAgenda(moment().add({ week: 1 }))
    ctx.reply(`Estas são as tarefas da semana`, botoesAgenda(tarefas))
})

// Comando que apresenta as tarefas concluidas em ordem de criação
bot.command('concluidas', async ctx => {
    const tarefas = await getConcluidas()
    ctx.reply('Estas são as tarefas que você já concluiu', botoesAgenda(tarefas))
})

// Comando que apresenta as tarefas que nao tem datas definidas
bot.command('tarefas', async ctx => {
    const tarefas = await getTarefas()
    ctx.reply(`Estas são as tarefas sem data definida`, botoesAgenda(tarefas))
})

// Ação de mostrar as tarefas que é usado em botoesAgenda
bot.action(/mostrar (.+)/, async ctx => {
    await exibirTarefa(ctx, ctx.match[1])// Exibindo a tarefa que foi clicada chamando a função exibirTarefa
})

// Ação de concluir uma tarefa usado no botoesAgenda
bot.action(/concluir (.+)/, async ctx => {
    await concluirTarefa(ctx.match[1])
    await exibirTarefa(ctx, ctx.match[1])
    await ctx.reply('Tarefa Concluída')
})

// Ação de excluir uma tarefa usado no botoesAgenda
bot.action(/excluir (.+)/, async ctx => {
    await excluirTarefa(ctx.match[1])
    await ctx.editMessageText('Tarefa Excluída')
})

// Criando Teclado com atalho para datas
const tecladoDatas = Markup.keyboard([
    ['Hoje', 'Amanhã'],
    ['1 Semana', '1 Mês'],
]).resize().oneTime().extra()

let idTarefa = null // Deixando null o idTarefa

const dataScene = new Scene('data') // Instanciando dataScene id data

dataScene.enter(ctx => {
    idTarefa = ctx.match[1]
    ctx.reply(`Gostaria de definir alguma data?`, tecladoDatas)
})// Quando entramos na scene data

dataScene.leave(ctx => idTarefa = null)// Quando saimos da scene deixamos idTarefa null novamente

// Tratando quando é digitado hoje, é adicionando ao data o dia atual atraves da função moment()
dataScene.hears(/hoje/gi, async ctx => {
    const data = moment()
    handleData(ctx, data)
})

// Tratando quando é digitado amanha, é adicionando ao data o dia atual + 1 dia atraves da função moment()
dataScene.hears(/(Amanh[ãa])/gi, async ctx => {
    const data = moment().add({ days: 1 })
    handleData(ctx, data)
})

// Tratando quando é digitado dias, é adicionando ao data o dia atual + o numero de dia atraves da função moment()
dataScene.hears(/^(\d+) dias?$/gi, async ctx => {
    const data = moment().add({ days: ctx.match[1] })
    handleData(ctx, data)
})

// Tratando quando é digitado semanas, é adicionando ao data o dia atual + o numero de semanas atraves da função moment()
dataScene.hears(/^(\d+) semanas?/gi, async ctx => {
    const data = moment().add({ weeks: ctx.match[1] })
    handleData(ctx, data)
})

// Tratando quando é digitado Meses, é adicionando ao data o dia atual + o numero de Meses atraves da função moment()
dataScene.hears(/^(\d+) m[eê]s(es)?/gi, async ctx => {
    const data = moment().add({ months: ctx.match[1] })
    handleData(ctx, data)
})

// Trando quando a data é passada direto pelo teclado ela é formatada para o padrão do moment
dataScene.hears(/(\d{2}\-\d{2}\-\d{4})/g, async ctx => {
    const data = moment(ctx.match[1], 'DD-MM-YYYY')
    handleData(ctx, data)
})

// Função que envia as datas tratadas
const handleData = async (ctx, data) => {
    await atualizarDataTarefa(idTarefa, data)// Aqui a data é atualizada na tarefa
    await ctx.reply('Data Atualizada!')// Mensagem enviada ao usuario 
    await exibirTarefa(ctx, idTarefa, true)// Exibe novamente a tarefa
    ctx.scene.leave()// Sai da scene
}

// Quando a mensagem enviada dentro da dataScene não entra em nenhum opção acima
dataScene.on('message', ctx => ctx.reply('Padrões aceitos\ndd-MM-YYYY\nX dias\nX semanas\nX meses', tecladoDatas))

const obsScene = new Scene('observacoes') // Instanciando obsScene id observacoes

obsScene.enter( ctx => {
    idTarefa = ctx.match[1]
    ctx.reply('Já pode adicionar suas anotações...')
})// Quando entramos na obsScene

obsScene.leave(ctx => idTarefa = null)// Quando saimos da scene deixamos idTarefa null novamente

// Tratando o evento de texto da observação
obsScene.on('text', async ctx => {
    const tarefa = await getTarefa(idTarefa)
    const novoTexto = ctx.update.message.text
    const obs = tarefa.observacao ? tarefa.observacao + '\n----\n' + novoTexto : novoTexto // Em observação caso tenha uma adicionamos '\n----\n' + a nova observação senão apenas a nova observação
    const res = await atualizarObsTarefa(idTarefa, obs)
    await ctx.reply('Observação Adicionada')
    await exibirTarefa(ctx, idTarefa, true)
    ctx.scene.leave()
})

// Quando a mensagem enviada dentro da obsScene não entra na opção acima
obsScene.on('message', ctx => ctx.reply('Apenas observações em texto são aceitas'))

const stage = new Stage([dataScene, obsScene])
bot.use(session())
bot.use(stage.middleware())

bot.action(/setData (.+)/, Stage.enter('data'))
bot.action(/addNota (.+)/, Stage.enter('observacoes'))


// Essa tem que ser a ordem para que essa função do bot não atrapalhe na captura das outras informações.
bot.on('text', async ctx => {
    try {
        const tarefa = await incluirTarefa(ctx.update.message.text)
        await exibirTarefa(ctx, tarefa.id, true)
    } catch (err){
        console.log(err)
    }
})

bot.startPolling()



