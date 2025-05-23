'use strict';

export default (sequelize, DataTypes) => {
    const AllSchedule = sequelize.define(
        'AllSchedule',
        {
            doctorId: DataTypes.INTEGER,
            specializationId: DataTypes.INTEGER,
            statusId: DataTypes.INTEGER,
            type: {
                type: DataTypes.ENUM('regular', 'on-call'),
                allowNull: false,
            },
            // Ngày bắt đầu ca
            date: DataTypes.DATEONLY,
            // Thời gian bắt đầu chính xác
            startTime: DataTypes.DATE,
            // Thời gian kết thúc chính xác
            endTime: DataTypes.DATE,
            // ghi chú thêm
            notes: DataTypes.TEXT,

            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            tableName: 'AllSchedule', // Đặt tên bảng chính xác
            freezeTableName: true, // Ngăn Sequelize tự động chuyển đổi tên bảng
        }
    );
    AllSchedule.associate = function (models) {
        models.AllSchedule.belongsTo(models.User, { foreignKey: 'doctorId' });
        models.AllSchedule.belongsTo(models.Specialization, { foreignKey: 'specializationId' });
        models.AllSchedule.belongsTo(models.Status, { foreignKey: 'statusId' });
    };
    return AllSchedule;
};
