const { MessageMedia } = require('whatsapp-web.js');
const TwitterService = require("../service/TwitterService");

module.exports = {
    async execute(link) {
        try {

            console.log("link twitter", link)
            const data = await (new TwitterService()).getUrl(link);

            if (!data.ok) {
                return null
            }

            return await MessageMedia.fromUrl(data.url);
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
