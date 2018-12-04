const moment = require('moment')
const axios = require('axios')

const baseUrl = 'http://localhost:3001/tarefas'

// Função responsavel por verificar o que tem na agenda (GET)
const getAgenda = async data => {
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`// Ordenando a busca por data de previsao e passando a descrição
    const res = await axios.get(url)// Chamando a API de forma assincrona
    const pendente = item => item.dt_conclusao === null && moment(item.dt_previsao).isSameOrBefore(data)// Deixando apenas nas pesquisas itens que seguem os criterios que são itens que a data de conclusão esta nula e items com a data igual ou inferior a que foi passada
    return res.data.filter(pendente) // Retornando os itens que passaram pelo filtro 
}

// Função responsavel por verificar uma tarefa (GET)
const getTarefa = async id => {
    const resp = await axios.get(`${baseUrl}/${id}`)// Chamando a API de forma assincrona basando a urlbase e o id
    return resp.data // Retornando a tarefa
}

// Função que apresenta as tarefas que não tem data nem de previsao nem de conclusão (GET)
const getTarefas = async () => {
    const res = await axios.get(`${baseUrl}?_sort=descricao&_order=asc`)
    return res.data.filter(item => item.dt_previsao === null && item.dt_conclusao === null)
}

// Função que apresenta as tarefas concluidas (GET)
const getConcluidas = async () => {
    const res = await axios.get(`${baseUrl}?_sort=dt_previsao,descricao&_order=asc`)
    return res.data.filter(item => item.dt_conclusao !== null )
}

// Função de inclusão de tarefas (POST)
const incluirTarefa = async desc => {
    const res = await axios.post(`${baseUrl}`, { descricao: desc, dt_previsao: null, dt_conclusao: null, observacao: null})
    return res.data
}

// Função de concluir taredas (PUT)
const concluirTarefa = async id => {
    const tarefa = await getTarefa(id)
    const res = await axios.put(`${baseUrl}/${id}`, { ...tarefa, dt_conclusao: moment().format('YYYY-MM-DD') }) // O ... serve para abrir o objeto e adicionar na conclusão a datatem que formatar novamente a data para YYYY-MM-DD
    return res.data
}

// Função de deletar tarefa (DELETE)
const excluirTarefa = async id => {
    await axios.delete(`${baseUrl}/${id}`)
}

// Função para atualizar a data que a tarefa deve ser feita (PUT)
const atualizarDataTarefa = async (idTarefa, data) => {
    const tarefa = await getTarefa(idTarefa)
    const res = await axios.put(`${baseUrl}/${idTarefa}`, { ...tarefa, dt_previsao: data.format('YYYY-MM-DD') })
    return res.data
}

// Função para atualizar a observação da tarefa
const atualizarObsTarefa = async (idTarefa, obs) => {
    const tarefa = await getTarefa(idTarefa)
    const res = await axios.put(`${baseUrl}/${idTarefa}`, { ...tarefa, observacao: obs})
    return res.data
}

module.exports = {
    getAgenda,
    getTarefa,
    getTarefas,
    getConcluidas,
    incluirTarefa,
    concluirTarefa,
    excluirTarefa,
    atualizarDataTarefa,
    atualizarObsTarefa
}