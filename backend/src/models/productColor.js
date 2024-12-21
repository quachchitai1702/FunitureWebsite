'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductColor extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductColor.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });
        }
    }
    ProductColor.init({
        productId: DataTypes.INTEGER,
        color: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductColor',
    });
    return ProductColor;
};