'use strict';
module.exports = (sequelize, DataTypes) => {
    const Doctor_User = sequelize.define(
        'Doctor_User',
        {
            doctorId: DataTypes.INTEGER,
            specializationId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {}
    );
    Doctor_User.associate = function (models) {
        models.Doctor_User.belongsTo(models.User, { foreignKey: 'doctorId' });
        models.Doctor_User.belongsTo(models.Specialization, { foreignKey: 'specializationId' });
    };
    return Doctor_User;
};
