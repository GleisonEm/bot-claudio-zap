const { ConverseModel } = require('../db/models/ConverseModel');
const { MessageTypes, MessageMedia } = require('whatsapp-web.js');
const AudioTranscriber = require('../models/AudioTranscriber');
const { getSender } = require('../utils/utilitary');

class PrivateMessage {
    constructor(client) {
        this.client = client
        this.states = {
            waiting: 1,
            sendMenu: 2,
            inactive: 3,
        };
        this.converseModel = new ConverseModel();
        this.audioTranscriber = new AudioTranscriber();
    }

    async runner(msg) {
        // const chatId = msg.from;
        const command = msg.body.split(' ')[0];

        if (msg.type === MessageTypes.AUDIO || msg.type === MessageTypes.VOICE) {
            await msg.reply("Transcrevendo audio...");
            const data = await msg.downloadMedia()
            const text = await this.audioTranscriber.run(data);

            await msg.reply(text);
        }

        if (command == '!sticker') {
            const sender = getSender(msg)
            if (msg.type === "image") {

                try {
                    const { data } = await msg.downloadMedia();
                    const image = new MessageMedia("image/jpeg", data, "image.jpg");
                    await this.client.sendMessage(sender, image, { sendMediaAsSticker: true });
                } catch (e) {
                    console.log(e)
                    msg.react('❌');
                }
            } else {
                try {
                    const url = msg.body.substring(msg.body.indexOf(" ")).trim();
                    const { data } = await axios.get(url, { responseType: 'arraybuffer' });
                    const returnedB64 = Buffer.from(data).toString('base64');
                    const image = new MessageMedia("image/jpeg", returnedB64, "image.jpg");
                    await this.client.sendMessage(sender, image, { sendMediaAsSticker: true });
                } catch (e) {
                    msg.react('❌');
                }
            }
        }
        // let currentState = await this.converseModel.getState(chatId);
        // console.log("state atual", currentState)
        // if (!currentState) {
        //     // Se não existe um estado, criar um
        //     currentState = (await this.converseModel.save({ from: chatId, state: this.states.sendMenu })).state;
        // }

        // if (currentState === 1) {
        //     if (command == '1') {
        //         // Lógica para traduzir uma imagem
        //         msg.reply('Executando tradução de imagem...');
        //     } else if (command == '2') {
        //         // Lógica para transcrever um áudio
        //         msg.reply('Executando transcrição de áudio...');
        //     } else {
        //         // Resposta inválida
        //         msg.reply('Opção inválida. Por favor, escolha 1 ou 2.');
        //     }

        //     // Resetar estado
        //     await this.converseModel.update(this.states.inactive, chatId);
        // }

        // if (currentState === 2) {
        //     // Se não estamos esperando uma resposta, enviar o menu de opções
        //     await msg.reply(
        //         'Escolha uma opção:\n' +
        //         '1. Traduzir uma imagem\n' +
        //         '2. Transcrever um áudio'
        //     );

        //     // Definir o estado para esperar uma resposta
        //     await this.converseModel.update(this.states.waiting, chatId);

        // }

        // console.log("state atual mudado", await this.converseModel.getState(chatId))
    }
}

module.exports = PrivateMessage;
