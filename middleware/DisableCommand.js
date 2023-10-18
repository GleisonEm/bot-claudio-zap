const { GroupModel } = require("../db/models/GroupModel");

const DisableCommand = async (contextId) => (new GroupModel()).isDisableCommands(contextId);


module.exports = DisableCommand