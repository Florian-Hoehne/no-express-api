

const cookie = {}

// Max-Age=720; Path=/; Expires=Tue, 26 Jan 2021 14:49:38 GMT
cookie.Cookie = class Cookie {
    constructor(obj = {}) {
        this.key = null
        this.value = null
        this.domain = null
        this.sessionId = null
        this.hhtpOnly = null
        this.maxAge = null
        Object.assign(this, obj)
    }
}

cookie.parse = (value) => {

}

/**
 *
 * @param {Cookie} cookie
 * @return {Promise<void>}
 */
cookie.sign = async (cookie) => {

}

module.exports = cookie
