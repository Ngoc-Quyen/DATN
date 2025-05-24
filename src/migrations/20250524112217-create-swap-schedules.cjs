'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('swapschedules', {
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
            doctorSwapId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            dateASwap: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            dateBSwap: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            reason: {
                type: Sequelize.TEXT,
            },
            type: {
                type: Sequelize.STRING,
            },
            statusId: {
                allowNull: false,
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
        return queryInterface.dropTable('swapschedules');
    },
};
