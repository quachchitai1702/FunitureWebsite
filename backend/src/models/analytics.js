'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Analytic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Analytic.init({
        totalSales: DataTypes.DECIMAL,
        totalOrders: DataTypes.INTEGER,
        totalCustomers: DataTypes.INTEGER,
        reportDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Analytic',
        timestamps: false
    });
    return Analytic;
};