const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  accountId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  appSecretToken: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Website must be a valid URL',
        protocols: ['http', 'https'],
        require_protocol: true
      }
    }
  }
}, {
  timestamps: true,
  paranoid: true, // Enables soft deletion
  hooks: {
    beforeValidate: (account) => {
      // Generate accountId if not provided
      if (!account.accountId) {
        account.accountId = `acc_${require('crypto').randomBytes(8).toString('hex')}`;
      }
      // Generate appSecretToken if not provided
      if (!account.appSecretToken) {
        account.appSecretToken = `tok_${require('crypto').randomBytes(16).toString('hex')}`;
      }
    }
  }
});

// Define associations
Account.associate = (models) => {
  Account.hasMany(models.Destination, {
    foreignKey: 'accountId',
    as: 'destinations',
    onDelete: 'CASCADE' // Cascade delete destinations when account is deleted
  });
};

module.exports = Account;