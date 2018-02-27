'use strict'

const Sequelize = require('sequelize')
const sequelize = require('../util/mysql')

module.exports = sequelize.define('face', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: Sequelize.STRING,
  title: Sequelize.STRING,
  comment: Sequelize.STRING,
}, {
  // don't forget to enable timestamps
  timestamps: true,
  // don't delete database entries but set the newly added attribute deletedAt
  // to the current date (when deletion was done). paranoid will only work if
  // timestamps are enabled
  paranoid: true,
})
