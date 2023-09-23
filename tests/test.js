const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');

// Nome do arquivo .opus de entrada
const inputFile = './output.opus';

// Nome do arquivo .wav de saída
const outputFile = 'output2.wav';

let track = './source.mp3';//your path to source file

ffmpeg(inputFile)
    .toFormat('wav')
    .on('error', (err) => {
        console.log('An error occurred: ' + err.message);
    })
    .on('progress', (progress) => {
        // console.log(JSON.stringify(progress));
        console.log('Processing: ' + progress.targetSize + ' KB converted');
    })
    .on('end', () => {
        console.log('Processing finished !');
    })
    .save('./hello.wav');//path where you want to save your file

