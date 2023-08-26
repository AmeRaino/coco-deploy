module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'CourseReviews',
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
            rate: DataTypes.INTEGER,
            content: DataTypes.STRING
        },
        {
            tableName: 'course_reviews'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
        Model.belongsTo(models.User, { foreignKey: 'create_by_user_id', as: 'create_by_user' });
        Model.belongsToMany(models.CourseReviewSuggestionTag, {
            through: {
                model: 'CourseReviewTag',
                unique: false
            },
            foreignKey: 'course_review_id',
            otherKey: 'course_review_suggestion_tag_id',
            as: 'review_tag',
            attributes: []
        });
    };
    return Model;
};
