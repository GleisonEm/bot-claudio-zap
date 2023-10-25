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
const { removeAccents } = require('./utils/utilitary');

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
    let chat = await msg.getChat();
    // if (await DisableCommand(chat.id.user, await msg.getContact())) {
    //     console.log("Grupo com comandos desativados")

    //     if ((await msg.getContact()).contact.number !== process.env.OWNER) {
    //         if (msg.body.includes('!')) msg.react('⛔')
    //         return;
    //     }
    // }
    const useCase = getSocialMediaType(command)
    if (useCase) {
        messageHandler.handle(msg, client, useCase);
        return;
    }

    if (!chat.isGroup) {
        await handlePrivateMessage(msg, client);
        return;
    }

    const commandHandler = new CommandHandler(client);

    if (typeof commandHandler[command] === 'function') {
        commandHandler[command](msg, client);
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

    // if (link.includes('//youtu.be') || link.includes('//www.youtube.com')) {
    //     return YoutubeVideoUseCase;
    // }

    return null
}

function formattedCommand(msg) {

    const command = msg.split(' ')[0];
    return removeAccents(command.toLowerCase());
}