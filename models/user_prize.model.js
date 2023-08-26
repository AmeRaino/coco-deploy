module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserPrize',
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
            prize: DataTypes.STRING,
            achievements: DataTypes.STRING,
            received_date: DataTypes.STRING,
            describe: DataTypes.STRING
        },
        {
            tableName: 'user_prize'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
