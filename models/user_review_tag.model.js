module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserReviewTag',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_review_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            user_review_suggestion_tag_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'user_review_tag'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.CourseReviews, { foreignKey: 'user_review_id', as: 'user_review' });
        Model.belongsTo(models.CourseReviewSuggestionTag, { foreignKey: 'user_review_suggestion_tag_id', as: 'user_review_suggestion_tag' });
    };
    return Model;
};
