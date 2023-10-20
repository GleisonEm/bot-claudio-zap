const { default: axios } = require('axios');
const ytdl = require('ytdl-core');

class YoutubeService {
    async getUrl(link) {
        try {
            const data = await ytdl.getBasicInfo(link);
            const defaultQualitity = '720p'

            const video = data.formats.find(
                item => item.qualityLabel === defaultQualitity && item.mimeType.includes('mp4')
            ) || data.formats.find(item => item.mimeType.includes('mp4'));

            if (!video) return {
                message: "❌",
                ok: false
            };

            return {
                ok: true,
                url: video.url,
            }
        } catch (e) {
            console.log(e)
            return null
        }
    }
    async downloadBase64(url) {
        return axios.get(
            url,
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
}

module.exports = new YoutubeService();