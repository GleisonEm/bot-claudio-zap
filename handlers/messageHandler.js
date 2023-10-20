const { getSender } = require("../utils/utilitary");

module.exports = {
    async handle(msg, client, useCase) {

        try {
            msg.react('⏳');
            const sender = getSender(msg)
            console.log(msg.body, "messagehandler")
            const response = await useCase.execute(msg.body);

            await msg.reply(response);
        } catch (e) {
            console.log(e)
            msg.react('❌');
        }
    }
}