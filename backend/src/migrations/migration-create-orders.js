'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            customerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Customers',
                    key: 'id',
                },
                allowNull: false,
            },
            totalAmount: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            status: {
                type: Sequelize.ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending'
            },
            paymentMethod: {
                allowNull: false,
                type: Sequelize.STRING
            },
            shippingAddress: {
                allowNull: false,
                type: Sequelize.STRING
            },
            orderDate: {
                allowNull: false,
                type: Sequelize.DATE
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
        await queryInterface.dropTable('Orders');
    }
};