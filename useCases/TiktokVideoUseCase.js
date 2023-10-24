const { MessageMedia } = require("whatsapp-web.js");
const { getVideoWM, downloadBase64, formatRedirectUrl } = require("../service/TiktokService");

module.exports = {
    async execute(link) {
        try {

            if (link.includes('vm.tiktok.com')) {
                const data = await formatRedirectUrl(link)
                if (!data.url) return null
                link = data.url;
            }

            console.log("link tiktok", link)
            const data = await getVideoWM(link);
            console.log("getbase54", data)
            if (!data.url) {
                return null
            }

            // const dataVideo = await downloadBase64(data.url);
            // console.log(dataVideo)

            return [
                await MessageMedia.fromUrl(data.url, { unsafeMime: true })
            ];
        } catch (e) {
            console.log(e)
            return null
        }
    }
}
