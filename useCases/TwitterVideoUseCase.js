const { MessageMedia } = require('whatsapp-web.js');
const TwitterService = require("../service/TwitterService");

module.exports = {
    async execute(link) {
        try {

            console.log("link twitter", link)
            // const data = await (new TwitterService()).getUrl(link);
            const data = await (new TwitterService()).getUrlWithoutLib(link);
            console.log('data twitter', data)
            if (!data.ok) {
                return null
            }

            const media = await MessageMedia.fromUrl(data.url)
            return [
                data.text,
                null,
                { media: media }
            ];
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
