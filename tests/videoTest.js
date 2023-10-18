const axios = require('axios');
const fs = require('fs');

// const urlDoVideo = 'https://twitter.com/i/status/1710330763806195784';  // Substitua pela URL do seu vídeo
const caminhoDestino = 'video.mp4';  // Caminho onde você deseja salvar o vídeo localmente
const urlDoVideo = 'https://youtu.be/0b-bLSsNSR0'
axios({
    url: urlDoVideo,
    method: 'GET',
    responseType: 'stream',  // Indica que a resposta deve ser tratada como um stream
})
    .then(response => {
        const stream = fs.createWriteStream(caminhoDestino);
        response.data.pipe(stream);

        return new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
    })
    .then(() => {
        console.log('Vídeo baixado e salvo com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao baixar o vídeo:', error);
    });