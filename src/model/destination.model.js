const { DataTypes } = require('sequelize');
const sequelize = require('./connection'); // Make sure this path is correct

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  httpMethod: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
    allowNull: false,
    defaultValue: 'POST'
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isObject(value) {
        if (typeof value !== 'object' || value === null) {
          throw new Error('Headers must be an object');
        }
      }
    }
  }
}, {
  timestamps: true,
  paranoid: true // Enable soft deletion
});

// Define the association with Account
Destination.associate = function(models) {
  Destination.belongsTo(models.Account, {
    foreignKey: {
      name: 'accountId',
      allowNull: false
    },
    onDelete: 'CASCADE' // This ensures destinations are deleted when account is deleted
  });
};

module.exports = Destination;