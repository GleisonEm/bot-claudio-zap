const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class AudioUploader {
    constructor() {
        this.apiUrl = 'http://192.168.0.106:5000/extractTextByAudio';
    }

    async uploadAudio(
        audioFilePath,
        audioOriginalFilePath,
        fieldName = 'audio'
    ) {
        const audioData = fs.readFileSync(audioFilePath);
        const form = new FormData();
        form.append(fieldName, audioData, {
            filename: 'audio.wav',
            contentType: 'audio/wav',
        });

        // Envia o arquivo para a API usando Axios
        return axios.post(this.apiUrl, form, {
            headers: {
                ...form.getHeaders(), // Define os cabeçalhos apropriados para o FormData
            },
        }).then((responseData) => {
            console.log('Resposta da API:', responseData.data);
            fs.unlinkSync(audioFilePath);
            fs.unlinkSync(audioOriginalFilePath);
            return responseData.data;
        }).catch((error) => {
            console.error('Erro ao enviar o arquivo para a API:', error);
            return 'Erro ao enviar o arquivo para a API:';
        });
    }
}

module.exports = AudioUploader;