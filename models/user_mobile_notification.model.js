module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserMobileNotification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            notification_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
        },
        {
            tableName: 'user_mobile_notification'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.Notification, {
            foreignKey: 'notification_id',
            as: 'notification'
        });
        Model.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return Model;
};
