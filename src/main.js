const db        = require('./db')
const server    = require('./server')

const api       = require('./api')

console.time('test')

setTimeout(() => {
    //console.timeStamp('test')
    console.timeLog('test', 'done')
    console.timeEnd('test')
}, 3000)


//db.init()

server.setAllowedPaths(api)

module.exports = server
