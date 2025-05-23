'use strict';
export default (sequelize, DataTypes) => {
    const Post = sequelize.define(
        'Post',
        {
            title: DataTypes.STRING,
            contentMarkdown: DataTypes.TEXT,
            contentHTML: DataTypes.TEXT,
            forDoctorId: DataTypes.INTEGER,
            forSpecializationId: DataTypes.INTEGER,
            writerId: DataTypes.INTEGER,
            confirmByDoctor: DataTypes.STRING,
            image: DataTypes.STRING,
            isActive: DataTypes.TINYINT(0),
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {}
    );
    Post.associate = function (models) {
        models.Post.belongsTo(models.User, { foreignKey: 'forDoctorId' });
        models.Post.belongsTo(models.Specialization, { foreignKey: 'forSpecializationId' });
    };
    return Post;
};
