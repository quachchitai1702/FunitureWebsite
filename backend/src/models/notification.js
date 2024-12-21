'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Notification.belongsTo(models.Customer, {
                foreignKey: 'customerId',
                as: 'customer'
            });

            Notification.belongsTo(models.Staff, {
                foreignKey: 'staffId',
                as: 'staff'
            });
        }
    }
    Notification.init({
        customerId: DataTypes.INTEGER,
        staffId: DataTypes.INTEGER,
        message: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        createAt: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};