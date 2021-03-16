/**
 * http mini server
 * @author fho
 * @description
 */

// Dependencies
const {ServerResponse, IncomingMessage, createServer} = require('http')
const path = require('path')
const fs = require('fs')

const {URL} = require('url')
const {Exchange} = require("./Exchange")
const {Request} = require('./Request')
const {Response} = require('./Response')

const logger = require('../logger')('main:server')
const header = require('./header')

// Container Object
const server = {};

// Base directory - Assuming minimal-dynamic-http-server will be accessed from its own folder
const baseDir = path.join(__dirname, '../');

/**
 * handles a error in exchange process
 * @param {Exchange} exchange
 * @return {Promise<void>}
 */
server.errorHandler = async (exchange) => {
    if(exchange.err) {
        const response = exchange.res
        if(response.status >= 400 && response.body instanceof String) {
            response.end()
        }
        else if(response.status >= 400) {
            response.body = 'error occurred while processing message'
        }
        else {
            response.status = 500
            response.body = 'internal server error'
        }

        response.end()
    }
}

/**
 * Get the content type for a given path
 * @param {string} url - url extracted from request.url
 */
server.getContentType = url => {
    // Set the default content type to application/octet-stream
    let contentType = 'application/octet-stream';

    // Get the file extension
    const extname = path.extname(url);
    const mimeTypes = header.mimeTypes

    // Set the contentType based on the mime type
    for (let key in mimeTypes) {
        if (mimeTypes.hasOwnProperty(key)) {
            if (extname === key) {
                contentType = mimeTypes[key];
            }
        }
    }
    return contentType;
};

/**
 * Serve the static content
 * @param {string} pathname - request.url - such as /public/index.html
 * @param {Object} response - response object expected by the http.createServer callback
 */
server.serveStaticContent = (pathname, response) => {
    // Get content type based on the file extension passed in the request url
    const contentType = server.getContentType(pathname)
    // Set the Content-Type response header
    response.setHeader('Content-Type', contentType)

    logger.info('serve static for %s', pathname)
    // Read the file and send the response
    fs.readFile(`${baseDir}${pathname}`, (error, data) => {
        if (!error) {
            response.writeHead(200)
            response.end(data)
        } else {
            response.writeHead(404)
            response.end('404 - File Not Found')
        }
    });
};

let allowedPaths = {};

/**
 * If incoming path is one of the allowed dynamic paths then return the path
 * else return false
 * @param {string} path
 */
server.getAllowedDynamicPath = path => {
    for (const key in allowedPaths) {
        if (allowedPaths.hasOwnProperty(key)) {
            if (path === key) {
                return path;
            }
        }
    }
    return false;
};

/**
 * Serve the dynamic content
 * @param {IncomingMessage} request message that was reived by this server
 * @param {ServerResponse} response - response object expected by the http.createServer callback
 *
 */
server.serveDynamicContent = (request, response) => {
    // Retrieve the HTTP method
    const method = request.method.toLowerCase()

    const baseUrl = request.headers.host
    const protocol = request.headers["sec-websocket-protocol"] ?? 'http://'
    const parsedUrl = new URL(request.url, protocol + baseUrl)

    // Retrieve the pathname and query object from the parsed url
    const { pathname, query } = parsedUrl;

    logger.info('serve dynamic for %s', pathname)

    // buffer holds the request body that might come with a POST or PUT request.
    let buffer = [];

    request.on('error', error => {
        logger.error('Error Occurred e: %s', error)
        response.writeHead(500)
        response.end('Error occurred while processing HTTP request', error)
    });

    request.on('data', chunk => {
        buffer.push(chunk)
    });

    request.on('end', () => {
        buffer = Buffer.concat(buffer)

        // Prepare the request data object to pass to the handler function
        const responseData = {
            method,
            pathname,
            query,
            buffer,
        }

        // Retrieve the handler for the path
        const handler = allowedPaths[pathname]

        if(handler instanceof Promise) {
            const ex = new Exchange(new Request(request), new Response(response))
            handler(ex)
                .then(exchange => logger.debug('handler end'))
                .catch(err => {
                        logger.error('exchange error occurred %s', err.message)
                        ex.err = err
                        return server.errorHandler(ex)
                    }
                )
                .finally(() => {
                    logger.info()
                })

        }

        handler(responseData, (statusCode = 200, data = {}, cookies = []) => {
            response.writeHead(statusCode)
            response.end(data)
        });
    });
};
/**
 * creates the http server instance
 */
const httpServer = createServer((request, response) => {
    const baseUrl = request.headers.host
    const protocol = request.headers["sec-websocket-protocol"] ?? 'http://'
    const url = new URL(request.url, protocol + baseUrl)
    const pathname = url.pathname

    logger.info('process request (%s) %s', request.method.toUpperCase(), url.pathname)

    const dynamicPath = server.getAllowedDynamicPath(pathname)
    if (dynamicPath) {
        server.serveDynamicContent(request, response);
    } else {
        server.serveStaticContent(pathname, response);
    }
});

/**
 *
 * PUBLIC METHODS
 *
 */
/**
 * Set allowed paths
 * @param {Object} paths - Object containing all the allowed paths
 */
server.setAllowedPaths = paths => {
    allowedPaths = paths;
};

/**
 * Main method to start the server
 * @param {number} port - default value 3000
 *
 */
server.init = (port = 3000) => {
    httpServer.listen(port, () => {
        logger.info('Server is listening on port %d', port);
    });
};

// Export module
module.exports = server
