'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('timeoff', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            reason: {
                type: Sequelize.TEXT,
            },
            statusId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            approverId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable('timeoff');
    },
};
