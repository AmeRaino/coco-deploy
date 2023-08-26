module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserConnection',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            created_by_user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            connected_user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            connected: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            connection_request: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: 'user_connection',
            uniqueKeys: {
                actions_unique: {
                    fields: ['created_by_user_id', 'connected_user_id'],
                },
            }
        },
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'created_by_user_id', as: 'created_by_user' });
        Model.belongsTo(models.User, { foreignKey: 'connected_user_id', as: 'connected_user' });
    };
    return Model;
};
