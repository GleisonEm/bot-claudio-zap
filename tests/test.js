// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegPath);
// const fs = require('fs');

// // Nome do arquivo .opus de entrada
// const inputFile = './output.opus';

// // Nome do arquivo .wav de saída
// const outputFile = 'output2.wav';

// let track = './source.mp3';//your path to source file

// ffmpeg(inputFile)
//     .toFormat('wav')
//     .on('error', (err) => {
//         console.log('An error occurred: ' + err.message);
//     })
//     .on('progress', (progress) => {
//         // console.log(JSON.stringify(progress));
//         console.log('Processing: ' + progress.targetSize + ' KB converted');
//     })
//     .on('end', () => {
//         console.log('Processing finished !');
//     })
//     .save('./hello.wav');//path where you want to save your file

// const axios = require('axios')

// axios.get('https://vm.tiktok.com/ZMj4HB9uE/').then((data) => {
//     console.log(data)
//     console.log(data.request.res.responseUrl)

// })

fetch('https://vm.tiktok.com/ZMj4HB9uE/')
  .then(response => {
    // Verifica se houve redirecionamento
    if (response.redirected) {
      // Obtém a URL final após redirecionamento
      const responseUrl = response.url;
      
      // Faça o que precisar com a URL final
      console.log('Response URL:', responseUrl);
    } else {
      console.log('A solicitação não foi redirecionada.');
    }
  })
  .catch(error => {
    console.error('Erro na solicitação:', error);
  });





