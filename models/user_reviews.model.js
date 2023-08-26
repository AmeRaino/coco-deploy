module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserReviews',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
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
            tableName: 'user_reviews'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user_reviews' });
        Model.belongsTo(models.User, { foreignKey: 'create_by_user_id', as: 'create_by_user' });
        Model.belongsToMany(models.UserReviewSuggestionTag, {
            through: {
                model: 'UserReviewTag',
                unique: false
            },
            foreignKey: 'user_review_id',
            otherKey: 'user_review_suggestion_tag_id',
            as: 'review_tag',
            attributes: []
        });
    };
    return Model;
};
