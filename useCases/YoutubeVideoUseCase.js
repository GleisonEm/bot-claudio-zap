const { MessageMedia } = require('whatsapp-web.js');
const YoutubeService = require("../service/YoutubeService");

module.exports = {
    async execute(link) {
        try {
            console.log("link youtube", link)
            const response = await YoutubeService.getUrl(link);
            console.log("url trans", response)
            if (!response.ok) {
                return null
            }
            console.log("url trans", response.url)

            const data = await YoutubeService.downloadBase64(response.url);

            if (!data.ok) return null

            return new MessageMedia("video/mp4", data.videoBase64, "video.mp4");
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
