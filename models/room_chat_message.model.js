const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChatMessage',
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
            message: { type: DataTypes.TEXT },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            isEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
            isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
            roomChatId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            }
        },
        {
            tableName: 'chat_room_message'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.RoomChatMember, { foreignKey: 'roomChatMemberId' }),
            Model.hasMany(models.RoomChatAttachment, {
                foreignKey: 'roomChatMessageId'
            }),
            Model.belongsTo(models.RoomChat, { foreignKey: 'roomChatId' });
    };

    return Model;
};
