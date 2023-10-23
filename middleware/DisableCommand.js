const { GroupModel } = require("../db/models/GroupModel");

const DisableCommand = async (contextId, contact) => {
    return (new GroupModel()).isDisableCommands(contextId);
}


module.exports = DisableCommand