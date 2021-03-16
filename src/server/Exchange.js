const {Request} = require('./Request')
const {Response} = require('./Response')

class Exchange {
    /**
     * inits a exchange object
     * @param {Request} req
     * @param {Response} res
     * @param {Error|null} err message exchange error
     * @param {Array<File>} attachments
     * @param {Map<String, *>} properties
     */
    constructor(req, res, err = null, attachments = [], properties = new Map)
    {
        /**
         * incoming request
         * @type {Request}
         */
        this.req = req

        /**
         * servers response
         * @type {Response}
         */
        this.res = res

        /**
         * attached files
         * @type {Array<File>}
         */
        this.attachments = attachments

        /**
         * change properties
         * @type {Map<String, *>}
         */
        this.properties = properties

        /**
         *
         * @type {Error|null}
         */
        this.err = err
    }
}

module.exports = {Exchange}
