'use strict';

export default (sequelize, DataTypes) => {
    const TimeOffs = sequelize.define(
        'TimeOffs',
        {
            doctorId: DataTypes.INTEGER,
            startDate: DataTypes.DATEONLY,
            endDate: DataTypes.DATEONLY,
            reason: DataTypes.TEXT,
            statusId: DataTypes.INTEGER,
            approverId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {}
    );
    TimeOffs.associate = function (models) {
        models.TimeOffs.belongsTo(models.User, { foreignKey: 'doctorId', as: 'Doctor' });
        models.TimeOffs.belongsTo(models.Status, { foreignKey: 'statusId' });
        models.TimeOffs.belongsTo(models.User, { foreignKey: 'approverId', as: 'Approver' });
    };
    return TimeOffs;
};
