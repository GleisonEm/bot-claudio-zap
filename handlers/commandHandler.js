const { getSender } = require("../utils/utilitary");

const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios')
const { createFile, addInList, getList, deleteFile, addRule, getRulesList, editRule } = require('../clientRepository');

class CommandHandler {
    constructor(client) {
        this.client = client
    }

    async '!balinha'(msg) {
        const chat = await msg.getChat();
        await chat.sendMessage(`Aí é com o famoso @558774006609` + " 😉", { mentions: ["558774006609@c.us"] });
    }

    async '@everyone'(msg) {
        const chat = await msg.getChat();
        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }

    async '@todes'(msg) {
        this['@everyone'](msg);
    }

    async '@here'(msg) {
        this['@everyone'](msg);
    }

    async '@channel'(msg) {
        this['@everyone'](msg);
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
    async '!create'(msg) {
        try {
            let argument = "";
            if (msg.body.includes("-a")) argument = msg.body.substring(msg.body.indexOf("-a") + 2).trim();

            createFile(msg.body.split(" ")[1], argument);
            this.client.sendMessage(sender, "Lista Criada com Sucesso!");
        } catch (error) {
            msg.reply("❌ Erro ao criar lista");
        }
    }

    async '!add'(msg) {
        try {
            const users = await msg.getMentions();
            const sender = getSender(msg);
            addInList(msg.body.split(" ")[1], users);
            this.client.sendMessage(sender, `Dados adicionados com sucesso!`);
        } catch (error) {
            msg.reply("❌ Erro ao adicionar na lista");
        }
    }

    async '!delete'(msg) {
        try {
            const sender = getSender(msg);
            deleteFile(msg.body.split(" ")[1]);
            this.client.sendMessage(sender, "Lista deletada com Sucesso!");
        } catch (error) {
            msg.reply("❌ Erro ao deletar lista");
        }
    }

    async '@go'(msg) {
        try {
            const fileName = msg.body.split(" ")[1];
            this.userMentions(fileName, msg);
        } catch (error) {
            msg.reply("❌ Erro ao mencionar usuários da lista");
        }
    }

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
