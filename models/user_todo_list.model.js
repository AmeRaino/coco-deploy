module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserTodoList',
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
            date: DataTypes.STRING,
            complete: {
                type: DataTypes.BOOLEAN,
                defaultValue: 0
            },
            describe: DataTypes.STRING
        },
        {
            tableName: 'user_todo_list'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
