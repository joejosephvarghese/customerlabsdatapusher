const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

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
      isUrl: {
        protocols: ['http', 'https'],
        require_protocol: true
      }
    }
  },
  httpMethod: {
    type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
    allowNull: false,
    defaultValue: 'POST',
    validate: {
      isIn: [['GET', 'POST', 'PUT', 'PATCH', 'DELETE']]
    }
  },
  headers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidHeaders(value) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          throw new Error('Headers must be a key-value object');
        }
        if (this.httpMethod !== 'GET' && !value['Content-Type']) {
          value['Content-Type'] = 'application/json'; // Set default Content-Type
        }
      }
    }
  },
  // Explicitly define the foreign key field
  accountId: {
    type: DataTypes.INTEGER, // Assuming Account uses INTEGER id
    allowNull: false,
    references: {
      model: 'Accounts', // This should match your Account table name
      key: 'id'
    }
  }
}, {
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['accountId'] // Index for better join performance
    }
  ]
});

// Corrected association
Destination.associate = function(models) {
  Destination.belongsTo(models.Account, {
    foreignKey: 'accountId', // Must match the field name above
    targetKey: 'id', // References Account's primary key
    onDelete: 'CASCADE',
    hooks: true // Ensure cascading works with paranoid
  });
};

module.exports = Destination;