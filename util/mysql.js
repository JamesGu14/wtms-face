'use strict'

const config = require('config')
const mysqlConfig = config.get('mysqlConfig');
const Sequelize = require('sequelize')
const sequelize = new Sequelize(mysqlConfig.dbName, mysqlConfig.username, mysqlConfig.password, {
  host: mysqlConfig.host,
  dialect: mysqlConfig.dialect,
})

module.exports = sequelize