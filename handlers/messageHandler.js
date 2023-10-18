const { getSender } = require("../utils/utilitary");

module.exports = {
    async handle(msg, client, useCase) {
        console.log("insta message handler")
        try {
            const sender = getSender(msg)

            const response = await useCase.execute(msg.body);
            await msg.reply(response);
        } catch (e) {
            console.log(e)
            msg.reply("❌ Erro ao processar menssagem");
        }
    }
}