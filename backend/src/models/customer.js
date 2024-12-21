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
      // define association here
      Staff.belongsTo(models.Account, {
        foreignKey: 'accountId',
        as: 'account',
      });
    }
  }
  Account.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'inactive', 'suspended'),
    imageUrl: DataTypes.STRING,
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Accountss',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};