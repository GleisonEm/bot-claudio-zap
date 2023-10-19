const { Group } = require('../connection');

class GroupModel {
    async save(data) {
        const newGroup = new Group(data);

        return await newGroup.save();
    }
    async update(state, chatId) {
        const update = { state: state };
        const filter = { from: chatId };

        await Group.findOneAndUpdate(filter, update);
    }
    async isDisableCommands(groupId) {
        const filter = { externalId: groupId };

        const find = await Group.findOne(filter);
        console.log("find disable commands", find)
        if (!find) {
            return false;
        }

        return find.disableCommand;
    }
}

module.exports = { GroupModel };
