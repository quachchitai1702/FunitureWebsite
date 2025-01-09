'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.hasOne(models.Customer, {
        foreignKey: 'accountId',
        as: 'customer',
      });

      Account.hasOne(models.Staff, {
        foreignKey: 'accountId',
        as: 'staff',
      });
    }
  }
  Account.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'inactive', 'suspended'),
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};