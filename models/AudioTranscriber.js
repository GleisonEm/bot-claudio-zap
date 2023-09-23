const Audio = require("../service/Audio");
const AudioUploader = require("../service/AudioUploader");

class AudioTranscriber {
    constructor() {
        this.audioService = new Audio();
        this.AudioUploaderService = new AudioUploader();
    }
    async run(media) {
        console.log(media.mimetype, media.filename, media.filesize)

        const audioFilePath = await this.audioService.prepareAudioFile(media.data, media.mimetype);
        console.log(audioFilePath)

        const audioWavFilePath = await this.audioService.convertAudioFileToWav(audioFilePath);

        return this.AudioUploaderService.uploadAudio(audioWavFilePath, audioFilePath)
            .then((response) => {
                return response.text;
            }).catch((error) => {
                return "❌ Erro ao transcrever o audio";
            });
    }
}

module.exports = AudioTranscriber;