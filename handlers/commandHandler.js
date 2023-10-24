const { getSender } = require("../utils/utilitary");

const { MessageMedia, MessageTypes } = require('whatsapp-web.js');
const axios = require('axios')
const { createFile, addInList, getList, deleteFile, addRule, getRulesList, editRule } = require('../clientRepository');
const { MentionModel } = require("../db/models/MentionModel");
const SoundFunnyApi = require("../service/SoundFunnyApi");
const AudioTranscriber = require("../models/AudioTranscriber");
const InstagramReelsUseCase = require("../useCases/InstagramReelsUseCase");
const YoutubeVideoUseCase = require("../useCases/YoutubeVideoUseCase");
const { GroupModel } = require("../db/models/GroupModel");

class CommandHandler {
    constructor(client) {
        this.client = client
        this.mentionModel = new MentionModel();
        this.soundFunnyApiService = new SoundFunnyApi();
        this.groupModel = new GroupModel();
        this.audioTranscriber = new AudioTranscriber();
    }

    async '!chats'(msg) {
        const chat = await msg.getChat();
        console.log(chat)
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

    async '!disablegroup'(msg) {
        // let argument = msg.body.replace('!disableGroup', "");
        const contact = await msg.getContact();

        if (contact.number !== process.env.OWNER) {
            await msg.react('❌')
            return;
        }

        console.log(msg.from, msg.to, getSender(msg))
        let chat = await msg.getChat()
        console.log(chat.id.user == '120363177489507909')
        console.log(chat.id)

        this.groupModel.find(chat.id.user).then((doc) => {
            if (!doc) {
                return this.groupModel.save({ externalId: chat.id.user, disableCommand: true })
                    .then(() => msg.react('✅')).catch((err) => {
                        console.log('errr findOneAndReplaceOrSave', err)
                        return msg.react('❌')
                    })
            } else {
                this.groupModel.updateDisableCommand(chat.id.user, doc.disableCommand)
                    .then(() => msg.react('✅')).catch((err) => {
                        console.log('errr findOneAndReplaceOrSave', err)
                        return msg.react('❌')
                    })
            }


        }).catch((e) => {
            console.log('asdsada', e)
            msg.react('❌')
        })
        // this.groupModel.save({
        //     externalId: chat.id.user,
        //     disableCommand: true
        // })
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
                if (quotedMsg) await quotedMsg.react('❌');
                else await msg.react('❌');
                return;
            }
            const { data } = await axios.get(`https://www.myinstants.com${pathSoundFunny.soundPath}`, { responseType: 'arraybuffer' });

            const returnedB64 = Buffer.from(data).toString('base64');
            const audio = new MessageMedia("audio/mp3", returnedB64, "audio.mp3");

            if (quotedMsg) await quotedMsg.reply(audio, null, { sendAudioAsVoice: true });
            else await msg.reply(audio, null, { sendAudioAsVoice: true });
        } catch (e) {
            console.log(e)
            if (quotedMsg) await quotedMsg.react('❌');
            else await msg.react('❌');
        }
        console.log("terminou", new Date())
    }


    async '!a'(msg) {
        const sender = getSender(msg)
        console.log("entrou", new Date())
        const quotedMsg = await msg.getQuotedMessage();
        console.log("quotedMsg", quotedMsg)
        let argument = msg.body.replace('!a', "");

        const media = await MessageMedia.fromUrl('https://geea-storage.nyc3.cdn.digitaloceanspaces.com/2023-05-18%2007-46-09.mp4')
        await msg.reply(' ', null, { media: media });
        // if (!argument) return

        // try {
        //     const responseSoundFunnyApi = await this.soundFunnyApiService.getSoundBase64(argument)
        //     console.log('sound funny', responseSoundFunnyApi.ok)
        //     if (!responseSoundFunnyApi.ok) {
        //         if (quotedMsg) await quotedMsg.reply(responseSoundFunnyApi.message)
        //         else await msg.reply(responseSoundFunnyApi.message);
        //         return;
        //     }
        //     const audio = new MessageMedia("audio/mp3", responseSoundFunnyApi.soundBase64, "audio.mp3");

        //     if (quotedMsg) await quotedMsg.reply(audio, null, { sendAudioAsVoice: true });
        //     else await msg.reply(audio, null, { sendAudioAsVoice: true });
        // } catch (e) {
        //     console.log(e)
        //     if (quotedMsg) await quotedMsg.react('❌');
        //     else await msg.react('❌');
        // }
        // console.log("terminou", new Date())
    }

    async '!sticker'(msg) {
        const sender = getSender(msg)
        const quotedMsg = await msg.getQuotedMessage();
        console.log(msg.type)
        const message = quotedMsg ? quotedMsg : msg;
        if (message.type === "image") {

            try {

                const message = quotedMsg ? quotedMsg : msg;
                const { data } = await message.downloadMedia();
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

    async '!insta'(msg) {
        console.log("insta command handler")
        const sender = getSender(msg)
        const link = msg.body.replace('!insta', "");
        console.log(msg.type)
        if (msg.type === "chat") {
            await msg.react('⌛')
            const video = await InstagramReelsUseCase.execute(link);
            if (!video) {
                await msg.react('❌');
                return;
            }
            await msg.reply(video);
        }
    }

    async '!youtube'(msg) {
        console.log("youtube command handler")
        const link = msg.body.replace('!youtube', "");
        console.log(msg.type)
        if (msg.type === "chat") {
            await msg.react('⌛')
            const video = await YoutubeVideoUseCase.execute(link);
            if (!video) {
                await msg.react('❌');
                return;
            }
            await msg.reply(video);
            await msg.react('✅');
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
            msg.react('❌');
        }
    }

    async '!resume'(msg) {
        const chat = await msg.getChat();
        const msghistory = await chat.fetchMessages({ limit: chat.unreadCount, fromMe: false });

        msghistory.pop();

        const { BingChat } = await import('bing-chat');
        const array = msghistory.map(async (m) => {
            const contact = await m.getContact()
            const mensage = m.body;

            return {
                contact,
                mensage
            }
        })
        console.log(process.env.COOKIE_BINGCHAT)
        const api = new BingChat({
            cookie: process.env.COOKIE_BINGCHAT
        })

        const arrayWithContacts = await Promise.all(array);
        const parsedArray = arrayWithContacts.map(c => `${c.contact.name} disse: ${c.mensage}`)

        let text = parsedArray.join(",");

        const res = await api.sendMessage(`resuma da melhor forma possivel o assunto gerado em um grupo de whatsapp com as seguintes mensagens separadas por virgula: ${text}`)
        console.log("res", res, res.text)
        const cleanedRes = res.text.substring(res.text.indexOf(":") + 1).trim()
        await msg.reply(cleanedRes)
        console.log(cleanedRes)
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
            msg.react('❌');
        }
    }

    async '!rules:add'(msg) {
        try {
            const sender = getSender(msg);
            let rule = msg.body.substring(msg.body.indexOf(" ")).trim();
            addRule(sender.split("@")[0], rule);
            this.client.sendMessage(sender, `Regra atualizada com sucesso!`);
        } catch (error) {
            msg.react('❌');
        }
    }

    async '!rules:edit'(msg) {
        try {
            const sender = getSender(msg);
            let rule = msg.body.substring(msg.body.indexOf(" ")).trim();
            editRule(sender.split("@")[0], rule);
            this.client.sendMessage(sender, `Regra adicionada com sucesso!`);
        } catch (error) {
            msg.react('❌');
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
            msg.react('❌');
        }
    }
}

module.exports = CommandHandler;
