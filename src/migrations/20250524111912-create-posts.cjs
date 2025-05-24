'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            contentMarkdown: {
                type: Sequelize.TEXT,
            },
            contentHTML: {
                type: Sequelize.TEXT,
            },
            forDoctorId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            forSpecializationId: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            writerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            confirmByDoctor: {
                type: Sequelize.TINYINT(1),
                allowNull: true,
            },
            image: {
                type: Sequelize.STRING,
            },
            isActive: {
                type: Sequelize.TINYINT(0),
                defaultValue: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Posts');
    },
};
