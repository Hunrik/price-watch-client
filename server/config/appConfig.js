/* Use this old export style until sequelize cli supports es6 syntax */
// const DB_TYPES = require('./constants').DB_TYPES

/*
 * Set DB_TYPE to a database of your choice:
 * - MONGO: MongoDB
 * - POSTGRES: Postgresql
 * - NONE: There is no DB connection
 */

function defaultExport () {}

defaultExport.DB_TYPE = 'DYNAMO'
defaultExport.ENV = process.env.NODE_ENV || 'development'
defaultExport.LAMBDA_KEY = process.env.LAMBDA_KEY || ''
defaultExport.ENQUE_KEY = process.env.ENQUE_KEY || ''

module.exports = defaultExport
