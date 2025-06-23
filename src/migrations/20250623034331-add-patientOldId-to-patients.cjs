'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Patients', 'patientOldId', {
            type: Sequelize.INTEGER,
            allowNull: true, // Cho phép null => có dữ liệu hay không đều được
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Patients', 'patientOldId');
    },
};
