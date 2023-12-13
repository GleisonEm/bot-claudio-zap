const qrcode = require('qrcode-terminal');
const client = require('./config/client'); // Importe a autenticação

require('dotenv').config();

const PrivateMessage = require('./service/PrivateMessage');
const CommandHandler = require('./handlers/commandHandler');
const DisableCommand = require('./middleware/DisableCommand');
const messageHandler = require('./handlers/messageHandler');
const { removeAccents, getSocialMediaType, formattedCommand } = require('./utils/utilitary');
const express = require('express')
const cors = require("cors");

const app = express();

app.use(cors());

// app.use(urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

app.post("/send", async (req, res) => {
    const media = await MessageMedia.fromUrl(data.url)
    const text = 'Azera GLS 3.3 Motor V6Ano 2008
Muito novo
    Automático
Banco de Couro
Camera de Ré'

Fipe R$32.901,00 R$3.901,00 abaixo da Fipe.'
    client.sendMessage('120363177489507909@g.us',, { media: media })
    res.json({ message: "Mensagem enviada" });
});

const PORT = process.env.PORT || 3025;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });



    client.on('message', async msg => {
        console.log(msg.from)
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

    client.initialize();

    const handlePrivateMessage = async (msg, client) => {
        try {
            const privateMessageHandler = new PrivateMessage(client);
            await privateMessageHandler.runner(msg);
        } catch (error) {
            console.error('Erro ao lidar com a mensagem privada:', error);
        }
    }

});