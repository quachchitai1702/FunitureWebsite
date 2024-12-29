'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
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
  Staff.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.ENUM('active', 'inactive', 'suspended'),
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
    modelName: 'Staff',
  });
  return Staff;
};