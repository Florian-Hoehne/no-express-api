const oracledb  =  require('oracledb')
const config    = require('./config')
const logger    = require('./logger')('db:db')
const liquibase = require('liquibase')

const db = {}

oracledb.autoCommit = true

/**
 * available datasource map
 * @type {Map<any, any>}
 */
db.dataSources = new Map()

/**
 * current alive db connections
 * @type {*[]}
 */
db.connections = []

/**
 * creates a oracle connection pool
 * @param config
 * @return {Promise<void>}
 */
db.createConnectionPool = async (config) => {
    try {
        if(config.liquibase != null) {
            await liquibase(config.liquibase)
                .run('update')
        }
        await oracledb.createPool(config)
    } catch (err) {
        throw err
    }
}

db.register = async (config) => {
    try {
        await db.createConnectionPool(config)
        db.connections.push(config.poolAlias)
        logger.info(config.poolAlias + ' pool ready')
    }
    catch (e) {
        logger.error(`unable to connect to ${config.connectString} err: ${e}`)
        throw e
    }
}

/**
 * returns the database connection
 * @param alias
 * @return {Promise<Connection>}
 */
db.connect = async (alias)  => new Promise((resolve, reject) => {
    if(db.dataSources.has(alias))
    {
        let source = db.dataSources.get(alias)
        source.getConnection()
            .then(connection => resolve(connection))
            .catch(err => reject(new Error(`unable to get record connection ${alias} : ${err}`)))
    }
    else {
        reject(new Error('record datasource is not initialized'))
    }
})

db.disconnect = async () => {
    logger.info('close connection pool')
    try {
        await Promise.all(db.connections.map(async (poolName) => {
            await oracledb.getPool(poolName).close(10)
            logger.info('db pool closed')
        }))
        process.exit(0)
    } catch(err) {
        logger.error(err)
    }
}

/**
 * close db connection properly 
 * after shutdown is requested
 */
process
    .once('SIGTERM', db.disconnect)
    .once('SIGINT',  db. disconnect)


/**
 * runs a db action
 * @return {Promise<void>}
 */
db.action = async (alias, transaction) => {
    let connection = await db.connect(alias)
    try {
        await transaction(connection)
        await connection.commit()
    }
    catch (err) {
        console.error(`transaction failed: Error='${err}' Rollback!`, 'recordAction')
        await connection.rollback()
        throw new Error('transaction failure Error=' + err.message ?? err)
    }
    finally {
        await connection.release()
    }
}


/**
 * runs a ipi db action
 * @type {Promise<void>}
 */
db.ipi = async (transaction) => db.action(config.ipi.poolAlias)


/**
 * runs a pd db action
 * @type {Promise<void>}
 */
db.pd = async (transaction) => db.action(config.pd.poolAlias)

/**
 * sets up the database connections
 * @return {Promise<void>}
 */
db.init = async () => {
    try {
        await db.register(config.ipi)
        const ipiConnectionPool = oracledb.getPool(config.ipi.poolAlias)

        db.dataSources.set(config.ipi.poolAlias, ipiConnectionPool)

        logger.info('connected to ipi datasource')

        await db.register(config.pd)
        const pdConnectionPool = oracledb.getPool(config.pd.poolAlias)

        logger.info('connected to pd datasource')

        db.dataSources.set(config.pd.poolAlias, pdConnectionPool)
    }
    catch (e) {
        logger.error('could not configure db connections e:%s', e.message)
    }
}



module.exports = db
