'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            category: {
                allowNull: false,
                type: Sequelize.STRING
            },
            material: {
                allowNull: false,
                type: Sequelize.STRING
            },
            stock: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            description: {
                allowNull: false,
                type: Sequelize.STRING
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Categories',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            status: {
                type: Sequelize.ENUM('available', 'out of stock', 'discontinued'),
                allowNull: false,
                defaultValue: 'available'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};