const { Converse } = require('../connection');

class ConverseModel {
    async save(data) {
        const newConverse = new Converse(data);

        return newConverse.save();
    }
    async update(state, chatId) {
        const update = { state: state };
        const filter = { from: chatId };

        await Converse.findOneAndUpdate(filter, update);
    }
    async getState(chatId) {
        const filter = { from: chatId };

        const find = await Converse.findOne(filter);

        return find.state;
    }
}

module.exports = { ConverseModel };
