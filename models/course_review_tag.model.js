module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'CourseReviewTag',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            course_review_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            course_review_suggestion_tag_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'course_review_tag'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.CourseReviews, { foreignKey: 'course_review_id', as: 'course_review' });
        Model.belongsTo(models.CourseReviewSuggestionTag, { foreignKey: 'course_review_suggestion_tag_id', as: 'course_review_suggestion_tag' });
    };
    return Model;
};
