const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Conversation',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            uid: {
                type: DataTypes.STRING
            },
            lastMessageId: {
                type: DataTypes.INTEGER
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: 'conversation'
        }
    );

    Model.associate = function (models) {
        Model.hasMany(models.ConversationMember, {
            foreignKey: 'conversationId',
            as: 'conversation_members'
        });
    };

    return Model;
};
