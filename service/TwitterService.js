const getTwitterMedia = require('get-twitter-media');

class TwitterService {
    async getUrl(
        url
    ) {
        if (url.includes('x.com')) {
            url = url.replace('//x.com', '//twitter.com')
        }

        return getTwitterMedia(url, {
            buffer: true
        }).then((res) => {
            console.log(res);
            if (!res.media) {
                return {
                    message: "❌",
                    ok: false
                };
            }

            const media = res.media[0]
            return {
                message: "Sucesso",
                ok: true,
                url: media.url,
                text: media.text ? media.text : null,
            }
        }).catch((error) => {
            return {
                message: "❌",
                ok: false
            };
        });
    }
}

module.exports = TwitterService;