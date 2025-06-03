
const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const crypto = require('crypto');
const paginate = require('./plugin/paginate.plugin'); 

const generateObjectId = () => {
  return crypto.randomBytes(12).toString('hex');
};



const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.STRING(24), // MongoDB ObjectIDs are 24-character hex strings
    primaryKey: true,
    allowNull: false,
    defaultValue: generateObjectId,
    validate: {
      is: /^[0-9a-fA-F]{24}$/ 
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
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
    onDelete: 'CASCADE', 
    hooks: true 
  });
};
paginate(Account);
module.exports = Account;
