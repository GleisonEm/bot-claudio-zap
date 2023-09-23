const qrcode = require('qrcode-terminal');
const client = require('./config/client'); // Importe a autenticação

require('dotenv').config();


const PrivateMessage = require('./service/PrivateMessage');
const CommandHandler = require('./handlers/commandHandler');

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

    if (!chat.isGroup) {
        await handlePrivateMessage(msg);

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

const handlePrivateMessage = async (msg) => {
    try {
        const privateMessageHandler = new PrivateMessage();
        await privateMessageHandler.runner(msg);
    } catch (error) {
        console.error('Erro ao lidar com a mensagem privada:', error);
    }
}