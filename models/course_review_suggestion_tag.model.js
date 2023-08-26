module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'CourseReviewSuggestionTag',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            tag_en: DataTypes.STRING,
            tag_vi: DataTypes.STRING
        },
        {
            tableName: 'course_review_suggestion_tag'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.CourseReviewTag, { foreignKey: 'course_review_suggestion_tag_id', as: 'course_review_tag' });
    };
    return Model;
};
