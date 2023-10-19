const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

class Audio {
    async prepareAudioFile(base64, mimeType) {

        // Decodifica a string base64 para dados binários
        const binaryData = Buffer.from(base64, 'base64');

        // Define a extensão do arquivo com base no mimetype
        let fileExtension = '';
        if (mimeType === 'audio/ogg; codecs=opus') {
            fileExtension = 'opus';
        } else if (mimeType === 'audio/mpeg') {
            fileExtension = 'mp3';
        }

        const fileName = `./data/audio/output-${Date.now()}.${fileExtension}`; // Nome do arquivo de saída

        // Salva o arquivo de áudio com o mimetype original
        fs.writeFileSync(fileName, binaryData);

        console.log(`Arquivo ${fileName} salvo com mimetype ${mimeType}`);
        return fileName
    }
    async convertAudioFileToWav(fileName) {

        const outputPath = `./data/audio/audio-${Date.now()}.wav`;

        return new Promise((resolve, reject) => {
            ffmpeg(fileName)
                .toFormat('wav')
                .on('error', (err) => {
                    console.log('An error occurred: ' + err.message);
                    reject(err);
                })
                .on('progress', (progress) => {
                    console.log('Processing: ' + progress.targetSize + ' KB converted');
                })
                .on('end', () => {
                    console.log('Processing finished !');
                    resolve();
                })
                .save(outputPath);
        })
            .then(() => {
                console.log('File saved successfully!');
                return outputPath
            })
            .catch((err) => {
                console.error('Error processing audio:', err);

            });
    }
}

module.exports = Audio;