const { getSender } = require("../utils/utilitary");

const { MessageMedia, MessageTypes } = require('whatsapp-web.js');
const axios = require('axios')
const { createFile, addInList, getList, deleteFile, addRule, getRulesList, editRule } = require('../clientRepository');
const { MentionModel } = require("../db/models/MentionModel");
const SoundFunnyApi = require("../service/SoundFunnyApi");
const { Group } = require("../db/connection");
const AudioTranscriber = require("../models/AudioTranscriber");
const InstagramService = require("../service/InstagramService");
const InstagramReelsUseCase = require("../useCases/InstagramReelsUseCase");

class CommandHandler {
    constructor(client) {
        this.client = client
        this.mentionModel = new MentionModel();
        this.soundFunnyApiService = new SoundFunnyApi();
        this.groupModel = new Group();
        this.audioTranscriber = new AudioTranscriber();
        this.instagramService = new InstagramService();
    }

    async '!balinha'(msg) {
        const chat = await msg.getChat();
        await chat.sendMessage(`Aí é com o famoso @558774006609` + " 😉", { mentions: ["558774006609@c.us"] });
    }

    // async '@everyone'(msg) {
    //     const chat = await msg.getChat();
    //     let text = "";
    //     let mentions = [];
    //     console.log("gtupo proibido", chat.id.user == '120363177489507909')
    //     if (chat.id.user == '120363177489507909') return;

    //     for (let participant of chat.participants) {
    //         const contact = await this.client.getContactById(participant.id._serialized);
    //         mentions.push(contact);
    //         text += `@${participant.id.user} `;
    //     }

    //     await chat.sendMessage(text, { mentions });
    // }

    // async '@todes'(msg) {
    //     this['@everyone'](msg);
    // }

    // async '@here'(msg) {
    //     this['@everyone'](msg);
    // }

    // async '@channel'(msg) {
    //     this['@everyone'](msg);
    // }

    async '!disableGroup'(msg) {
        // let argument = msg.body.replace('!disableGroup', "");
        let chat = await msg.getChat()

        console.log(chat.id.user == '120363177489507909')
        console.log(chat.id)
        const result = await this.groupModel.save({
            idExternal: chat.id.user,
            disableCommand: true
        })
        console.log(result)
    }

    async '!transcrever'(msg) {
        const quotedMsg = await msg.getQuotedMessage();
        // let argument = msg.body.replace('!disableGroup', "");
        if (!quotedMsg) {
            console.log('n respondeu nenhum audio')
            return;
        }
        console.log(quotedMsg.type, "tipo da mensagem")
        if (quotedMsg.type === MessageTypes.AUDIO || quotedMsg.type === MessageTypes.VOICE) {
            await quotedMsg.reply("Transcrevendo audio...");
            const data = await quotedMsg.downloadMedia()
            const text = await this.audioTranscriber.run(data);

            await quotedMsg.reply(text); 0
        }
    }

    async '!audio'(msg) {
        console.log("entrou", new Date())
        const quotedMsg = await msg.getQuotedMessage();
        console.log("quotedMsg", quotedMsg)
        let argument = msg.body.replace('!audio', "");
        if (!argument) return

        try {
            const pathSoundFunny = await this.soundFunnyApiService.getPath(argument)
            console.log('sound funny', pathSoundFunny)
            if (!pathSoundFunny.ok) {
                if (quotedMsg) await quotedMsg.reply(pathSoundFunny.message)
                else await msg.reply(pathSoundFunny.message);
                return;
            }
            const { data } = await axios.get(`https://www.myinstants.com${pathSoundFunny.soundPath}`, { responseType: 'arraybuffer' });

            const returnedB64 = Buffer.from(data).toString('base64');
            const audio = new MessageMedia("audio/mp3", returnedB64, "audio.mp3");

            if (quotedMsg) await quotedMsg.reply(audio, null, { sendAudioAsVoice: true });
            else await msg.reply(audio, null, { sendAudioAsVoice: true });
        } catch (e) {
            console.log(e)
            if (quotedMsg) await quotedMsg.reply("❌ Não foi possível baixar o audio");
            else await msg.reply("❌ Não foi possível baixar o audio");
        }
        console.log("terminou", new Date())
    }


    async '!a'(msg) {
        console.log("entrou", new Date())
        const quotedMsg = await msg.getQuotedMessage();
        console.log("quotedMsg", quotedMsg)
        let argument = msg.body.replace('!a', "");
        if (!argument) return

        try {
            const responseSoundFunnyApi = await this.soundFunnyApiService.getSoundBase64(argument)
            console.log('sound funny', responseSoundFunnyApi.ok)
            if (!responseSoundFunnyApi.ok) {
                if (quotedMsg) await quotedMsg.reply(responseSoundFunnyApi.message)
                else await msg.reply(responseSoundFunnyApi.message);
                return;
            }
            const audio = new MessageMedia("audio/mp3", responseSoundFunnyApi.soundBase64, "audio.mp3");

            if (quotedMsg) await quotedMsg.reply(audio, null, { sendAudioAsVoice: true });
            else await msg.reply(audio, null, { sendAudioAsVoice: true });
        } catch (e) {
            console.log(e)
            if (quotedMsg) await quotedMsg.reply("❌ Não foi possível baixar o audio");
            else await msg.reply("❌ Não foi possível baixar o audio");
        }
        console.log("terminou", new Date())
    }

    async '!sticker'(msg) {
        const sender = getSender(msg)
        if (msg.type === "image") {

            try {
                const { data } = await msg.downloadMedia();
                const image = new MessageMedia("image/jpeg", data, "image.jpg");
                await this.client.sendMessage(sender, image, { sendMediaAsSticker: true });
            } catch (e) {
                console.log(e)
                msg.reply("❌ Erro ao processar imagem");
            }
        } else {
            try {
                const url = msg.body.substring(msg.body.indexOf(" ")).trim();
                const { data } = await axios.get(url, { responseType: 'arraybuffer' });
                const returnedB64 = Buffer.from(data).toString('base64');
                const image = new MessageMedia("image/jpeg", returnedB64, "image.jpg");
                await this.client.sendMessage(sender, image, { sendMediaAsSticker: true });
            } catch (e) {
                msg.reply("❌ Não foi possível gerar um sticker com esse link");
            }
        }
    }

    async '!insta'(msg) {
        console.log("insta command handler")
        const sender = getSender(msg)
        const link = msg.body.replace('!insta', "");
        console.log(msg.type)
        if (msg.type === "chat") {

            const video = await InstagramReelsUseCase.execute(link);
            if (!video) {
                msg.reply("❌ Erro ao processar o link");
                return;
            }
            await msg.reply(video);
        }
    }

    async '!create'(msg) {
        try {
            let argument = "";
            if (msg.body.includes("-a")) argument = msg.body.substring(msg.body.indexOf("-a") + 2).trim();

            await this.mentionModel.save({
                title: msg.body.split(" ")[1],
                grupoId: argument,
                users: [],
            });

            const sender = getSender(msg);
            this.client.sendMessage(sender, "Lista Criada com Sucesso!");
        } catch (error) {
            msg.reply("❌ Erro ao criar lista");
        }
    }


    // async '!add'(msg) {
    //     try {
    //         const users = await msg.getMentions();
    //         const sender = getSender(msg);

    //         const mention = await this.mentionModel.find(msg.body.split(" ")[1]);

    //         if (!mention) {
    //             this.client.sendMessage(sender, "Lista não encontrada.");
    //             return;
    //         }

    //         mention.users.push(...users);
    //         await mention.save();

    //         this.client.sendMessage(sender, "Dados adicionados com sucesso!");
    //     } catch (error) {
    //         msg.reply("❌ Erro ao adicionar na lista");
    //     }
    // }

    // async '!delete'(msg) {
    //     try {
    //         const sender = getSender(msg);

    //         const mention = await Mention.findOne({ title: msg.body.split(" ")[1] });

    //         if (!mention) {
    //             this.client.sendMessage(sender, "Lista não encontrada.");
    //             return;
    //         }

    //         await mention.remove();

    //         this.client.sendMessage(sender, "Lista deletada com Sucesso!");
    //     } catch (error) {
    //         msg.reply("❌ Erro ao deletar lista");
    //     }
    // }

    // async '@go'(msg) {
    //     try {
    //         const fileName = msg.body.split(" ")[1];
    //         this.userMentions(fileName, msg);
    //     } catch (error) {
    //         msg.reply("❌ Erro ao mencionar usuários da lista");
    //     }
    // }

    async '!rules'(msg) {
        try {
            const sender = getSender(msg);
            let rules = await getRulesList(sender.split("@")[0]);
            if (rules.length <= 0) {
                this.client.sendMessage(sender, "Lista de regras Vazia!");
                return;
            }
            let newRules = rules.map((x, i) => (i + 1) + " - " + x + "\n").toString();
            const regex = /\n,/gi;
            this.client.sendMessage(sender, "Regras do Grupo: \n" + newRules.replace(regex, "\n"));
        } catch (error) {
            msg.reply("❌ Erro ao recuperar regras do grupo");
        }
    }

    async '!rules:add'(msg) {
        try {
            const sender = getSender(msg);
            let rule = msg.body.substring(msg.body.indexOf(" ")).trim();
            addRule(sender.split("@")[0], rule);
            this.client.sendMessage(sender, `Regra atualizada com sucesso!`);
        } catch (error) {
            msg.reply("❌ Erro ao atualizada Regra na lista");
        }
    }

    async '!rules:edit'(msg) {
        try {
            const sender = getSender(msg);
            let rule = msg.body.substring(msg.body.indexOf(" ")).trim();
            editRule(sender.split("@")[0], rule);
            this.client.sendMessage(sender, `Regra adicionada com sucesso!`);
        } catch (error) {
            msg.reply("❌ Erro ao adicionar Regra na lista");
        }
    }
    async userMentions(filename, msg) {

        try {
            const list = await getList(filename)
            const chat = await msg.getChat();

            const avaliableUsers = list.users.filter(x => chat.participants.some(d => d.id.user == x.id));


            let text = "";
            if (list.title.length > 0) {
                text += list.title;
            }
            let mentions = [];

            for (let user of avaliableUsers) {
                const contact = await this.client.getContactById(user.serialized);

                mentions.push(contact);
                text += `@${contact.id.user} `;
            }

            await chat.sendMessage(text + "\n", { mentions });
        } catch (error) {
            msg.reply("❌ Não foi possivel recuperar a lista")
        }
    }
}

module.exports = CommandHandler;
