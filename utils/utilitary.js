// Gerar um número inteiro aleatório entre min (incluído) e max (excluído)
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
const getSender = (msg) => {
    return msg.from.includes(process.env.BOT_NUMBER) ? msg.to : msg.from;
}

// Exemplo de uso
module.exports = { getRandomInt, getSender }
