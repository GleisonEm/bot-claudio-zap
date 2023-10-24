const fs = require('fs/promises');

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
const getSender = (msg) => {
    return msg.from.includes(process.env.BOT_NUMBER) ? msg.to : msg.from;
}

const removeAccents = (текст) => {
    return текст.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const writeLog = (name, json) => {
    fs.writeFile(`logs/${name}.json`, json, (err) => {
        if (err) console.log('log não escrito');
    });
}

const summarizeText = (text, limit) => {
    console.log(text)
    if (text.length <= limit) {
        return text;
    }

    const summarizedText = text.substring(0, limit);
    const lastComma = summarizedText.lastIndexOf(',');

    return lastComma !== -1 ? summarizedText.substring(0, lastComma) : summarizedText;
}

const isCommand = (message) => message.startsWith("!")

// Exemplo de uso
module.exports = { getRandomInt, getSender, removeAccents, writeLog, summarizeText, isCommand }
