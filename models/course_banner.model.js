module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'CourseBanner',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            course_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            create_by_user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            banner_url: DataTypes.STRING
        },
        {
            tableName: 'course_banner'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
        Model.belongsTo(models.User, { foreignKey: 'create_by_user_id', as: 'create_by_user' });
    };
    return Model;
};
