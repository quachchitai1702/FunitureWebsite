'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Analytics', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            totalSales: {
                allowNull: false,
                type: Sequelize.DECIMAL
            },
            totalOrders: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            totalCustomers: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            reportDate: {
                allowNull: false,
                type: Sequelize.DATE
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Analytics');
    }
};