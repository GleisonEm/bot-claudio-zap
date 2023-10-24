const qrcode = require('qrcode-terminal');
const client = require('./config/client'); // Importe a autenticação

require('dotenv').config();


const PrivateMessage = require('./service/PrivateMessage');
const CommandHandler = require('./handlers/commandHandler');
const DisableCommand = require('./middleware/DisableCommand');
const messageHandler = require('./handlers/messageHandler');
const InstagramReelsUseCase = require('./useCases/InstagramReelsUseCase');
const TiktokVideoUseCase = require('./useCases/TiktokVideoUseCase');
const TwitterVideoUseCase = require('./useCases/TwitterVideoUseCase');
const YoutubeService = require('./service/YoutubeService');
const YoutubeVideoUseCase = require('./useCases/YoutubeVideoUseCase');
const { list } = require('./models/CommandList');
const { removeAccents, isCommand } = require('./utils/utilitary');
const rateLimitMiddleware = require('./middleware/RateLimit');

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true, args: ['--no-sandbox'] }
// });

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    const command = formattedCommand(msg.body)
    const senderNumber = (await msg.getContact()).number
    let chat = await msg.getChat();

    if (isCommand(command)) {
        const rateLimitAllowed = rateLimitMiddleware.allowed(command, senderNumber)

        if (!rateLimitAllowed) {
            console.log(`[RATE LIMIT] command "${command}" not allowed for user ${senderNumber}`)
            msg.react('⛔')
            return false
        }

        const commandHandler = new CommandHandler(client);

        if (typeof commandHandler[command] === 'function') {
            commandHandler[command](msg, client);
            return true
        }
    }

    // if (await DisableCommand(chat.id.user, await msg.getContact())) {
    //     console.log("Grupo com comandos desativados")

    //     if ((await msg.getContact()).contact.number !== process.env.OWNER) {
    //         if (msg.body.includes('!')) msg.react('⛔')
    //         return;
    //     }
    // }
    const useCase = getSocialMediaType(command)

    if (useCase) {
        if (
            useCase.hasOwnProperty('associatedCommand') &&
            !rateLimitMiddleware.allowed(useCase.associatedCommand, senderNumber)
        ) {
            console.log(`[RATE LIMIT] command "${command}" not allowed for user ${senderNumber}`)
            msg.react('⛔')
            return
        }

        messageHandler.handle(msg, client, useCase);
        return;
    }

    if (!chat.isGroup) {
        await handlePrivateMessage(msg, client);
        return;
    }
})

// client.on('message_create', async msg => {

// });

client.initialize();

const handlePrivateMessage = async (msg, client) => {
    try {
        const privateMessageHandler = new PrivateMessage(client);
        await privateMessageHandler.runner(msg);
    } catch (error) {
        console.error('Erro ao lidar com a mensagem privada:', error);
    }
}

// function isHttpsLink(str) {

//     const httpsLinkRegex = /^https:\/\/[^ "]+$/;

//     return httpsLinkRegex.test(str);
// }

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