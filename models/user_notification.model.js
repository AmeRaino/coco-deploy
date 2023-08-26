module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserNotification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            notification_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                foreignKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                foreignKey: true
            }
        },
        {
            tableName: 'user_notification'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Model.belongsTo(models.Notification, {
            foreignKey: 'notification_id',
            as: 'notification'
        });
    };
    return Model;
};
