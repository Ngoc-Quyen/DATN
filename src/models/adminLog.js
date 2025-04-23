'use strict';
module.exports = (sequelize, DataTypes) => {
    const AdminLog = sequelize.define('AdminLog', {
        adminId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        content: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: DataTypes.DATE,
    }, {});
    AdminLog.associate = function(models) {
        models.AdminLog.belongsTo(models.Patient, { foreignKey: 'patientId' });
        models.AdminLog.belongsTo(models.User, { foreignKey: 'adminId' });
    };
    return AdminLog;
};
