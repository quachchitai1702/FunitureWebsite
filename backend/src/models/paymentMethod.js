'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PaymentMethod extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PaymentMethod.belongsTo(models.Customer, {
                foreignKey: 'customerId',
                as: 'customer',
            });
        }
    }
    PaymentMethod.init({
        customerId: DataTypes.INTEGER,
        cardNumber: DataTypes.STRING,
        cardholderName: DataTypes.STRING,
        expiryDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'PaymentMethod ',
    });
    return PaymentMethod;
};