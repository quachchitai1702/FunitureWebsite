'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.hasMany(models.ProductType, {
                foreignKey: 'productId',
                as: 'types',
            });

            Product.hasMany(models.ProductColor, {
                foreignKey: 'productId',
                as: 'colors',
            });

            Product.hasMany(models.ProductImage, {
                foreignKey: 'productId',
                as: 'images',
            });

            Product.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'productCategory',
            });
        }
    }
    Product.init({
        name: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        category: DataTypes.STRING,
        material: DataTypes.STRING,
        stock: DataTypes.INTEGER,
        description: DataTypes.STRING,
        status: DataTypes.ENUM('available', 'out of stock', 'discontinued'),
        categoryId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};