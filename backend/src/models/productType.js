'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProductType.belongsTo(models.Product, {
                foreignKey: 'productId',
                as: 'product',
            });
        }
    }
    ProductType.init({
        productId: DataTypes.INTEGER,
        type: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ProductType',
    });
    return ProductType;
};