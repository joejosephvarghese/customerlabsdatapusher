const { Sequelize } = require('sequelize');
const logger = require('../config/logger');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: msg => logger.debug(msg)
});

module.exports = sequelize;