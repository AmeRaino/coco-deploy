const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChatNotification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            roomChatMemberId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            isSeen: { type: DataTypes.BOOLEAN, defaultValue: false }
        },
        {
            tableName: 'chat_room_notification'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.RoomChatMember, { foreignKey: 'roomChatMemberId' });
    };

    return Model;
};
