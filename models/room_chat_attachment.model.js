const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChatAttachment',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            roomChatMessageId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            attachmentPath: { type: DataTypes.STRING },
            extensionAttachment: { type: DataTypes.STRING },
            originalNameAttachment: { type: DataTypes.STRING },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
        },
        {
            tableName: 'chat_room_attachment'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.RoomChatMessage, {
            foreignKey: 'roomChatMessageId'
        });
    };

    return Model;
};
