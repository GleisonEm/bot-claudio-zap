const commandRateLimitConfig = require("../config/commandRateLimit")

const COMMAND_LAST_USED = {}
const setLastUsedCommandForUser = (user, command, date) => {
    if (!COMMAND_LAST_USED[user]) {
        COMMAND_LAST_USED[user] = {[command]: date}
        return
    }

    COMMAND_LAST_USED[user][command] = date
}

const rateLimitMiddleware = {
    allowed (command, sender) {
        const now = new Date()
        const commandRateLimit = Number(
            commandRateLimitConfig[command] ?? process.env.DEFAULT_COMMAND_RATE_LIMI_IN_MINUTES
        )

        const lastUsedEntry = COMMAND_LAST_USED[sender]

        if (!lastUsedEntry) {
            setLastUsedCommandForUser(sender, command, now)
            return true
        }

        const lastUsedCommand = lastUsedEntry[command]

        if (!lastUsedCommand) {
            setLastUsedCommandForUser(sender, command, now)
            return true
        }

        const diffInMinutes = Math.round(
            (
                ((now - lastUsedCommand) % 86400000) % 3600000
            ) / 60000
        );
        const canContinue = diffInMinutes > commandRateLimit

        if (canContinue) {
            setLastUsedCommandForUser(sender, command, now)
            return true
        }

        return false
    }
}

module.exports = rateLimitMiddleware