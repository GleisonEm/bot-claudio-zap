const { default: axios } = require('axios');
const instagramDl = require('insta-scrapper-media');

class InstagramService {
    async getReelsBase64(
        url
    ) {
        console.log("insta url", url)
        const urlFormatted = url.replace(' ', '');
        const response = await instagramDl(urlFormatted);
        let data = response[0]

        if (!data.download_link) {
            return {
                message: "❌ Erro ao buscar o reels",
                ok: false
            };
        }

        return axios.get(
            data.download_link,
            { responseType: 'arraybuffer' }
        ).then((responseData) => {

            const videoBase64 = Buffer.from(responseData.data, 'binary').toString('base64');

            return {
                message: "Sucesso",
                ok: true,
                videoBase64: videoBase64
            };
        }).catch((error) => {
            console.error('Erro ao gerar o base64:', error);
            return {
                message: "❌ Erro ao buscar o base64",
                ok: false
            };
        });
    }
    async getReelsUrl(
        url
    ) {
        try {
            console.log("insta url", url)
            const urlFormatted = url.replace(' ', '');
            const response = await instagramDl(urlFormatted);
            let data = response[0]

            if (!data.download_link) {
                return {
                    message: "❌ Erro ao buscar o reels",
                    ok: false
                };
            }

            return {
                ok: true,
                url: data.download_link
            }
        } catch (e) {
            console.log('error ao nbuscar reels', e)
            return {
                message: "❌ Erro ao buscar o reels",
                ok: false
            };
        }
    }
}

module.exports = InstagramService;