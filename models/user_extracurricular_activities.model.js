module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserExtracurricularActivities',
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
            activity: DataTypes.STRING,
            position: DataTypes.STRING,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING,
            describe: DataTypes.STRING
        },
        {
            tableName: 'user_extracurricular_activities'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
