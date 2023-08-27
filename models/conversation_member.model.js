const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'ConversationMember',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            conversationId: {
                type: DataTypes.INTEGER
            },
            userId: {
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
            tableName: 'conversation_member'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.Conversation, {
            foreignKey: 'conversationId'
        });

        Model.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Model;
};
