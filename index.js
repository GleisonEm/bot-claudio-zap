const qrcode = require('qrcode-terminal');
const client = require('./config/client'); // Importe a autenticação

require('dotenv').config();


const PrivateMessage = require('./service/PrivateMessage');
const CommandHandler = require('./handlers/commandHandler');
const DisableCommand = require('./middleware/DisableCommand');
const messageHandler = require('./handlers/messageHandler');
const InstagramReelsUseCase = require('./useCases/InstagramReelsUseCase')

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

    const command = msg.body.split(' ')[0];
    let chat = await msg.getChat();

    if (isHttpsLink(command)) {
        messageHandler.handle(msg, client, InstagramReelsUseCase);
        return;
    }
    // if (await DisableCommand(chat.id.user)) {
    //     console.log("Grupo com comandos desativos", await DisableCommand(chat.id.user))
    //     return;
    // }

    if (!chat.isGroup) {
        await handlePrivateMessage(msg, client);

    } else {

        const commandHandler = new CommandHandler(client);

        if (typeof commandHandler[command] === 'function') {
            commandHandler[command](msg, client);
        }
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

function isHttpsLink(str) {

    const httpsLinkRegex = /^https:\/\/[^ "]+$/;

    return httpsLinkRegex.test(str);
}