module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Course',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            // user_id: {
            //   type: DataTypes.INTEGER,
            //   primaryKey: true
            // },
            consulting_field_id: DataTypes.INTEGER,
            center_name: DataTypes.STRING,
            teacher_name: DataTypes.STRING,
            teacher_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            name_en: DataTypes.STRING,
            name_vi: DataTypes.STRING,
            tuition: DataTypes.TEXT,
            detail_en: DataTypes.TEXT,
            detail_vi: DataTypes.TEXT,
            thumbnail: DataTypes.STRING,
            registration_link: DataTypes.TEXT,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING
        },
        {
            tableName: 'course'
        }
    );
    Model.associate = function (models) {
        // Model.belongsTo(models.User, { foreignKey: 'user_id',as: "mentor" })
        Model.belongsTo(models.ConsultingField, { foreignKey: 'consulting_field_id', as: 'consulting_field' });
        Model.hasMany(models.CourseBanner, { foreignKey: 'course_id', as: 'course_banner' });
        Model.hasMany(models.CourseReviews, { foreignKey: 'course_id', as: 'course_review' });
        Model.belongsTo(models.User, { foreignKey: 'teacher_id', as: 'user' });
        Model.hasMany(models.CourseMember, { foreignKey: 'course_id', as: 'course_member' });
    };
    return Model;
};
