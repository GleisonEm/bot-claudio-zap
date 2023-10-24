const getTwitterMedia = require('get-twitter-media');

class TwitterService {
    async getUrlWithoutLib(url) {
        const apiUrl = (this.formatUrl(url)).replace('//twitter.com', '//api.vxtwitter.com')

        return fetch(apiUrl).then(response => {
            if (!response.ok) {
                return {
                    message: "❌",
                    ok: false
                };
            }
            return response.json();
        }).then((data) => {
            console.log("resvxAPI", data);

            if (!data.mediaURLs) {
                return {
                    message: "❌",
                    ok: false
                };
            }

            return {
                message: "Sucesso",
                ok: true,
                url: data.mediaURLs[0],
                text: data.text ? data.text : '',
            }
        }).catch((error) => {
            console.log('error api vxtwitter', error)
            return {
                message: "❌",
                ok: false
            };
        });
    }
    async getUrl(
        url
    ) {
        url = this.formatUrl(url)

        return getTwitterMedia(url, {
            buffer: true
        }).then((res) => {
            console.log("res", res);
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
                text: media.text ? media.text : ' ',
            }
        }).catch((error) => {
            return {
                message: "❌",
                ok: false
            };
        });
    }
    formatUrl(url) {
        if (url.includes('x.com')) {
            return url.replace('//x.com', '//twitter.com')
        }

        return url
    }
}

module.exports = TwitterService;