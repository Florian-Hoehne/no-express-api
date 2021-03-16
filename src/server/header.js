const path = require('path')
const crypto = require('crypto')


/**
 * apply http headers to servers request
 * @type {Object}
 */
const header = {}

/**
 * supported content header mime types
 *
 * @type {{".html": string, ".ico": string, ".jgp": string, ".css": string, ".js": string, ".json": string, ".png": string}}
 */
header.mimeTypes = {
    '.html': 'text/html',
    '.jgp': 'image/jpeg',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.json': 'application/json'
}


header.signCookie = (cookie) => {

}

header.getSignedCookie = (headers) => {

}

/**
 * get the content type header
 * @param url
 * @return {string}
 */
header.getContentType = (url) => {
    // Set the default content type to application/octet-stream
    let contentType = 'application/octet-stream';
    // Get the file extension
    const extname = path.extname(url);
    // Set the contentType based on the mime type
    for (let key in mimeTypes) {
        if (mimeTypes.hasOwnProperty(key)) {
            if (extname === key) {
                contentType = mimeTypes[key];
            }
        }
    }
    return contentType;
}


module.exports = header
