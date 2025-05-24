'use strict';
export default (sequelize, DataTypes) => {
    const Status = sequelize.define(
        'Status',
        {
            name: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'statuses', // tên bảng trong DB
        }
    );
    Status.associate = function (models) {
        models.Status.hasOne(models.Patient);
    };
    return Status;
};
