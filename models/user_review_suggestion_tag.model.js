module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserReviewSuggestionTag',
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
            tableName: 'user_review_suggestion_tag'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.CourseReviewTag, { foreignKey: 'user_review_suggestion_tag_id', as: 'user_review_tag' });
    };
    return Model;
};
