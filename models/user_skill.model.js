module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserSkill',
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
            skill: DataTypes.STRING,
            describe: DataTypes.STRING
        },
        {
            tableName: 'user_skill'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
