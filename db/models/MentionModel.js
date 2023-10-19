const { Mention } = require('../connection');

class MentionModel {
    async save(data) {
        const newMention = new Mention(data);

        return newMention.save();
    }

    async update(state, chatId) {
        const update = { state: state };
        const filter = { from: chatId };

        await Mention.findOneAndUpdate(filter, update);
    }

    async find(title) {
        return Mention.findOne({ title: title })
    }

    async getState(chatId) {
        const filter = { from: chatId };

        const find = await Mention.findOne(filter);

        return find.state;
    }
}

module.exports = { MentionModel };
