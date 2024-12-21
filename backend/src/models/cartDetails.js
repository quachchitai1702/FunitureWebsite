'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CartDetail.belongsTo(models.Customer, {
                foreignKey: 'customerId',
                as: 'customer',
            });

            CartDetail.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });
        }
    }
    CartDetail.init({
        cartId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        price: DataTypes.DECIMAL,
    }, {
        sequelize,
        modelName: 'CartDetailDetail',
    });
    return CartDetail;
};