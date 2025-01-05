'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.Account, {
        foreignKey: 'accountId',
        as: 'account',
      });
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active', // Set default value to 'active'
    },

    imageUrl: DataTypes.STRING,
    accountId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Accounts',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};