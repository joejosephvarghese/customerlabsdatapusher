// src/database/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'), // Path to your SQLite file
  logging: console.log // Enable logging
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Synchronize all models
async function syncDatabase() {
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop tables in development
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
}

// Export the sequelize instance and initialization functions
module.exports = {
  sequelize,
  testConnection,
  syncDatabase
};