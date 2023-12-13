const Audio = require("../service/Audio");
const AudioUploader = require("../service/AudioUploader");

class Post {
    constructor() {
        this.audioService = new Audio();
        this.AudioUploaderService = new AudioUploader();
    }
}