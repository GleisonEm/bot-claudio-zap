const axios = require('axios');

class SoundFunnyApi {
    constructor() {
        this.apiUrl = 'http://159.223.198.152:8003/search';
        // this.apiUrl = process.env.SOUND_FUNNY_ENTRYPOINT;
    }
    async getPath(
        term
    ) {
        console.log(term)
        return axios.get(this.apiUrl + `?name=${term}`,).then((responseData) => {
            console.log('Resposta da API:', responseData.status);

            if (!responseData.data.soundPath.includes("/")) {
                return {
                    message: "❌",
                    ok: false
                };
            }


            return {
                message: "Sucesso",
                ok: true,
                soundPath: responseData.data.soundPath
            };
        }).catch((error) => {
            console.error('Erro ao busca path do som:', error);
            return {
                message: "❌",
                ok: false
            };
        });
    }
    async getSoundBase64(
        term
    ) {
        console.log(term)
        return axios.get(this.apiUrl + `searchWithBase64?name=${term}`,).then((responseData) => {
            console.log('Resposta da API:', responseData.status);

            if (!responseData.status == 200) {
                return {
                    message: "❌",
                    ok: false
                };
            }


            return {
                message: "Sucesso",
                ok: true,
                soundBase64: responseData.data.soundBase64
            };
        }).catch((error) => {
            console.error('Erro ao busca path do som:', error);
            return {
                message: "❌",
                ok: false
            };
        });
    }
}

module.exports = SoundFunnyApi;