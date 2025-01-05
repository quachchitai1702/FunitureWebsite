'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Cart.belongsTo(models.Customer, {
                foreignKey: 'customerId',
                as: 'customer',
            });

            Cart.hasMany(models.CartDetail, {
                foreignKey: 'cartId',
                as: 'cartDetails',
            });
        }
    }
    Cart.init({
        customerId: DataTypes.INTEGER,
        total: DataTypes.DECIMAL,
        createdAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Cart',
    });
    return Cart;
};