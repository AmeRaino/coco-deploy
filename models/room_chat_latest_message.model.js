const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChatLatestMessage',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            roomChatMessageId: { type: DataTypes.INTEGER },
            roomChatId: { type: DataTypes.INTEGER },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
        },
        {
            tableName: 'chat_room_latest_message'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.RoomChat, { foreignKey: 'roomChatId' });
        Model.belongsTo(models.RoomChatMessage, {
            foreignKey: 'roomChatMessageId'
        });
    };

    return Model;
};
