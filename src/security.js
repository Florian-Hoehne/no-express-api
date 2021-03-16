const crypto    = require('crypto')
const config    = require('./config')

const algorithm = config.security.algorithm.toString()
const password  = config.security?.key?.toString() ?? '***'
const iv        = config.security?.iv?.toString() ?? '***'

const logger    = require('./logger')('main:security')

module.exports.sign = async (value) => new Promise((resolve, reject) => {
    try
    {
        const hmac = crypto.createHmac('sha256', password)
        logger.debug('sign %s', value)
        let decrypted = hmac.update(value)
        
        resolve(decrypted + decipher.final('utf8'))
    }
    catch (e)
    {
        logger.error(`${e.code} could not decrypt ${text} due to error ${e.message}`)
        reject(e)
    }
})

/**
 * performs a aes decryption with base64 encoding
 * @param text
 * @returns {Promise<String>} decrypted value
 */
module.exports.decrypt = async (text) =>  new Promise((resolve, reject) => {
    try
    {
        logger.debug(`decrypt ${text} using ${algorithm}`)
        let decipher = crypto.createDecipheriv(algorithm, password, iv)
        let decrypted = decipher.update(text, 'base64', 'utf8')
        resolve(decrypted + decipher.final('utf8'))
    }
    catch (e)
    {
        logger.error(`${e.code} could not decrypt ${text} due to error ${e.message}`)
        reject(e)
    }
})

/**
 * performs a aes encryption with base64 encoding
 * @param {string} text
 * @return {Promise<string>}
 */
module.exports.encrypt = async (text) => new Promise((resolve, reject) => {
    try
    {
        logger.debug(`encrypt ${text} using ${algorithm}`)
        let cipher = crypto.createCipheriv(algorithm, password, iv)
        let encrypted = cipher.update(text, 'utf8', 'base64')
        encrypted += cipher.final('base64')
        resolve(encrypted)
    }
    catch (e)
    {
        logger.error(`${e.code} could not encrypt ${text} due to error ${e.message}`)
        reject(e)
    }
})

