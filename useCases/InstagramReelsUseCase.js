const { MessageMedia } = require("whatsapp-web.js");
const InstagramService = require("../service/InstagramService");

module.exports = {
    async execute(link) {
        try {
            const data = await (new InstagramService()).getReelsBase64(link);
            console.log(data)
            if (!data.ok) {
                await msg.react('❌');
                return;
            }

            return new MessageMedia("video/mp4", data.videoBase64, "video.mp4");
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
