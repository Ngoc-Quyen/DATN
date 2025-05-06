'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('allSchedule', {
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
            specializationId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            statusId: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            type: {
                type: Sequelize.ENUM('regular', 'on-call'),
                allowNull: false,
            },
            date: {
                type: Sequelize.DATEONLY,
            },
            startTime: {
                type: Sequelize.DATE,
            },
            endTime: {
                type: Sequelize.DATE,
            },
            notes: {
                type: Sequelize.TEXT,
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
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('allSchedule');
    },
};
