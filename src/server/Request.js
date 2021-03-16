const {IncomingMessage} = require('http')
const {URL} = require('url')

/**
 * incoming servers request
 */
class Request {

    /**
     *
     * @param {IncomingMessage} message
     */
    constructor(message)
    {
        const baseUrl = message.headers.host
        const protocol = message.headers["sec-websocket-protocol"] ?? 'http://'


        /**
         * request url
         * @type {URL}
         */
        this.url = new URL(message.url, protocol + baseUrl)

        /**
         * http method
         * @type {string}
         */
        this.method = message.method.toLocaleLowerCase()

        /**
         * received message headers
         */
        this.headers = message.headers

        /**
         * message that was send to the server
         * @type {IncomingMessage}
         */
        this.incommingMessage = message

        /**
         * request query
         */
        this.query = this.url.query
    }
}

module.exports = {Request}
