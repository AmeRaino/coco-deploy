const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoomChat',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false }
        },
        {
            tableName: 'chat_room'
        }
    );

    // Model.associate = function (models) {
    //   Model.belongsTo(models.User, { foreignKey: "createdBy" }),
    //     Model.hasMany(models.RoomChatMember, { foreignKey: "roomChatId" }),
    //     Model.hasMany(models.RoomChatMessage, { foreignKey: "roomChatId" });
    // };

    return Model;
};
