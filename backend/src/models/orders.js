'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Order.belongsTo(models.Customer, {
                foreignKey: 'customerId',
                as: 'customer',
            });

            Order.hasMany(models.OrderDetail, {
                foreignKey: 'orderId',
                as: 'orderDetails',
            });
        }
    }
    Order.init({
        customerId: DataTypes.INTEGER,
        totalAmount: DataTypes.DECIMAL,
        status: DataTypes.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
        paymentMethod: DataTypes.STRING,
        shippingAddress: DataTypes.STRING,
        orderDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};