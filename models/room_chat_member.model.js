const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChatMember',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: { type: DataTypes.INTEGER },
            roomChatId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            isBlocked: { type: DataTypes.BOOLEAN, defaultValue: false },
            isDeleted: { type: DataTypes.BOOLEAN }
        },
        {
            tableName: 'chat_room_member'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'userId' });
        Model.belongsTo(models.RoomChat, { foreignKey: 'roomChatId' });
        Model.hasMany(models.RoomChatMessage, { foreignKey: 'roomChatMemberId' });
        Model.hasMany(models.RoomChatNotification, {
            foreignKey: 'roomChatMemberId'
        });
        // Model.hasMany(models.EndUserInfo, { foreignKey: "roomChatMemberId" });
    };

    return Model;
};
