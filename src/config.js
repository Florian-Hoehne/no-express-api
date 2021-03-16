const env = process.env.NODE_ENV ?? 'dev'
const fs = require('fs')

const config = {}

config.server = {
    port: process.env.PORT ?? 8080,
    path: process.env.PATH ?? '/'
}

module.exports = config
