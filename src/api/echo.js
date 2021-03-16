const logger = require('../logger')('main:api:echo')

/**
 * serve echo message
 * @param res
 * @param next
 * @return {Promise<void>}
 */
const echo = async (res, next) => {
    next(200, 'Hello')
}

logger.info('echo route ready')

module.exports = echo
