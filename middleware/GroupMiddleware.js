const allowedGroup = (chatId) => {
    console.log(process.env.ENVIROMENT == 'prod' && chatId === process.env.GROUP_DEV_ID)
    if (process.env.ENVIROMENT == 'prod' && chatId !== process.env.GROUP_DEV_ID)
        return true;

    if (process.env.ENVIROMENT == 'dev' && chatId === process.env.GROUP_DEV_ID)
        return true;

    return false
}

module.exports = allowedGroup