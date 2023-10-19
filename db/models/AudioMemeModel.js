const { AudioMeme } = require('../connection');

class AudioMemeModel {
    async save(data) {
        const newAudioMeme = new AudioMeme(data);

        return newAudioMeme.save();
    }

    async updateTitle(newTitle, audioMemeId) {
        const filter = { _id: audioMemeId };
        const update = { title: newTitle };

        await AudioMeme.findOneAndUpdate(filter, update);
    }

    async find(searchTitle) {
        return AudioMeme.findOne({ title: { $regex: searchTitle, $options: 'i' } });
    }

    async updateUrl(newUrl, audioMemeId) {
        const filter = { _id: audioMemeId };
        const update = { url: newUrl };

        await AudioMeme.findOneAndUpdate(filter, update);
    }

    async getAllAudioMemes() {
        return AudioMeme.find();
    }

    async getAudioMemeById(audioMemeId) {
        return AudioMeme.findById(audioMemeId);
    }

    async deleteAudioMemeById(audioMemeId) {
        return AudioMeme.findByIdAndDelete(audioMemeId);
    }
}

module.exports = { AudioMemeModel };
