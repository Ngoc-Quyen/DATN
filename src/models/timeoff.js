'use strict';

module.exports = (sequelize, DataTypes) => {
    const TimeOff = sequelize.define(
        'TimeOff',
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
    TimeOff.associate = function (models) {
        models.TimeOff.belongsTo(models.User, { foreignKey: 'doctorId' });
        models.TimeOff.belongsTo(models.Status, { foreignKey: 'statusId' });
        models.TimeOff.belongsTo(models.User, { foreignKey: 'approvedId' });
    };
    return TimeOff;
};
