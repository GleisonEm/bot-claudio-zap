const { MessageMedia } = require("whatsapp-web.js");
const InstagramService = require("../service/InstagramService");

module.exports = {
    associatedCommand: '!instagram',
    async execute(link) {
        try {
            const data = await (new InstagramService()).getReelsUrl(link);
            console.log(data)
            if (!data.ok) {
                return null
            }

            return [
                await MessageMedia.fromUrl(data.url, { unsafeMime: true })
            ];
        } catch (e) {
            console.log('reels get insta error', e)
            return null
        }
    }
}
