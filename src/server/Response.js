const {ServerResponse} = require('http')


class Response {
    /**
     * wraps the servers output response
     * @param {ServerResponse} res
     */
    constructor(res) {
        /**
         * content type header
         * @type {string}
         */
        this.contentType = 'text'

        /**
         * server response
         * @type {ServerResponse}
         */
        this.response = res

        /**
         * http status code
         * @type {number}
         */
        this.status = 200

        /**
         * response body
         * @type {*|null}
         */
        this.body = null
    }

    ok() {
        this.status = 200
        return this
    }

    notFound() {
        this.status = 404
        return this
    }

    basicClientError() {
        this.status = 400
        return this
    }

    json(body) {
        this.contentType = 'application/json'
        this.body = JSON.stringify(body)
        return this
    }

    text(body) {
        this.contentType = 'text/plain'
        this.body = body
        return this
    }

    /**
     * closes the http response flow
     */
    end() {
        this.response.writeHead(this.status)
        this.response.end(this.body)
    }
}

module.exports = {Response}
