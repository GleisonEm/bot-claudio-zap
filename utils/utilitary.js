const fs = require('fs/promises');
const InstagramReelsUseCase = require('../useCases/InstagramReelsUseCase');
const TiktokVideoUseCase = require('../useCases/TiktokVideoUseCase');
const TwitterVideoUseCase = require('../useCases/TwitterVideoUseCase');
const YoutubeVideoUseCase = require('../useCases/YoutubeVideoUseCase');
const { list } = require('../models/CommandList');

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
const getSender = (msg) => {
    return msg.from.includes(process.env.BOT_NUMBER) ? msg.to : msg.from;
}

const removeAccents = (texto) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

function getSocialMediaType(link) {
    if (link.includes('tiktok.com')) {
        return TiktokVideoUseCase;
    }

    if (link.includes('instagram.com')) {
        return InstagramReelsUseCase;
    }

    if (link.includes('x.com') || link.includes('twitter.com')) {
        return TwitterVideoUseCase;
    }

    if (link.includes('//youtu.be') || link.includes('//www.youtube.com') || link.includes('//youtube.com')) {
        return YoutubeVideoUseCase;
    }

    return null
}

function formattedCommand(msg) {
    let command = Object.keys(list).find(command => msg.includes(command));


    if (command) {
        return command.toLowerCase()
    }

    command = msg.split(' ')[0];
    console.log('command', command)
    return removeAccents(command.toLowerCase());
}

// function isHttpsLink(str) {

//     const httpsLinkRegex = /^https:\/\/[^ "]+$/;

//     return httpsLinkRegex.test(str);
// }
// Exemplo de uso
module.exports = { getRandomInt, getSender, removeAccents, writeLog, summarizeText, formattedCommand, getSocialMediaType }
