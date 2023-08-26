const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Notification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: { type: DataTypes.STRING(100), allowNull: false },
            description: { type: DataTypes.STRING(1000), allowNull: false },
            content: { type: DataTypes.STRING, allowNull: false },
            created_user_id: { type: DataTypes.INTEGER, allowNull: false, foreignKey: true },
            is_schedule: { type: DataTypes.BOOLEAN, defaultValue: false },
            sent_time: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
            is_sent: { type: DataTypes.BOOLEAN, defaultValue: false },
            type_of_noti: { type: DataTypes.STRING, allowNull: false},
            sub_type_of_noti: DataTypes.STRING,
            is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
        },
        {
            tableName: 'notification',
            timestamps: false
        }
    );
    Model.associate = function (models) {
        Model.belongsToMany(models.User, {
            through: 'UserNotification',
            foreignKey: 'notification_id',
            otherKey: 'user_id',
            as: 'user',
            attributes: []
        });
        Model.hasMany(models.UserMobileNotification, {
            foreignKey: 'notification_id',
            as: 'user_mobile_notification'
        });
        Model.belongsTo(models.User, {
            foreignKey: 'created_user_id',
            as: 'created_user'
        });
    };
    return Model;
};
