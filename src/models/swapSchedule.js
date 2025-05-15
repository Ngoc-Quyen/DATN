'use strict';

module.exports = (sequelize, DataTypes) => {
    const SwapSchedules = sequelize.define(
        'SwapSchedules',
        {
            doctorId: DataTypes.INTEGER,
            doctorSwapId: DataTypes.INTEGER,
            dateASwap: DataTypes.DATEONLY,
            dateBSwap: DataTypes.DATEONLY,
            reason: DataTypes.TEXT,
            type: DataTypes.STRING,
            statusId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {}
    );
    SwapSchedules.associate = function (models) {
        models.SwapSchedules.belongsTo(models.User, { foreignKey: 'doctorId', as: 'Doctor' });
        models.SwapSchedules.belongsTo(models.Status, { foreignKey: 'statusId' });
        models.SwapSchedules.belongsTo(models.User, { foreignKey: 'doctorSwapId', as: 'DoctorSwap' });
    };
    return SwapSchedules;
};
