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
        require_protocol: true,
        require_valid_protocol: true
      },
      notEmpty: true
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
    type: DataTypes.JSONB, // Using JSONB for better performance in some databases
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidHeaders(value) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          throw new Error('Headers must be a key-value object');
        }
        // Ensure Content-Type exists for non-GET methods
        if (this.httpMethod !== 'GET' && !value['Content-Type']) {
          value['Content-Type'] = 'application/json';
        }
      }
    }
  },
accountId: {
  type: DataTypes.STRING(24), // Must match Account's id type
  allowNull: false,
  references: {
    model: 'Accounts',
    key: 'id'
  }
}
}, {
  timestamps: true,
  paranoid: true, // Enables soft deletion
  indexes: [
    {
      fields: ['accountId'],
      name: 'destination_accountId_index'
    },
    {
      fields: ['url', 'httpMethod'],
      unique: true,
      name: 'unique_destination_per_account'
    }
  ],
  hooks: {
    beforeValidate: (destination) => {
      // Normalize URL by removing trailing slashes
      if (destination.url) {
        destination.url = destination.url.replace(/\/+$/, '');
      }
    }
  }
});

// Enhanced association configuration
Destination.associate = function(models) {
  Destination.belongsTo(models.Account, {
    foreignKey: 'accountId',
    targetKey: 'id',
    as: 'account'
  });
};

module.exports = Destination;