'use strict';
export default (sequelize, DataTypes) => {
    const Specialization = sequelize.define(
        'Specialization', // tên model số ít
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'specializations', // tên bảng trong DB
        }
    );

    Specialization.associate = function (models) {
        Specialization.hasOne(models.Post);
    };

    return Specialization;
};
