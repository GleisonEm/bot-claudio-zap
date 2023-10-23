const { Group } = require('../connection');

class GroupModel {
    async save(data) {
        const newGroup = new Group(data);

        return await newGroup.save();
    }
    async updateDisableCommand(groupId, disabled) {
        return Group.updateOne({ externalId: groupId }, { disableCommand: !disabled })
            .then(() => true).catch((err) => {
                console.log('updateDisableCommand', err);
                return false;
            });
    }
    // async findOneAndReplaceOrSave(groupId, data) {
    //     const filter = { externalId: groupId };

    //     return Group.findOneAndReplace(filter, data).then((doc) => {
    //         console.log("find disable commands", doc, groupId)
    //         return doc
    //     }).catch((err) => {
    //         console.log(err);
    //         return false;
    //     });
    // }
    async find(groupId) {
        const filter = { externalId: groupId };

        return Group.findOne(filter).then((doc) => {
            console.log("find group", doc, groupId)
            return doc
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
    async isDisableCommands(groupId) {
        return Group.findOne({ externalId: groupId }).then((doc) => {
            console.log("find disable commands", doc, groupId)
            return true
        }).catch((err) => {
            console.log(err);
            return false;
        });
    }
}

module.exports = { GroupModel };
