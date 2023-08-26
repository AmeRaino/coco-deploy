const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'ConversationMessage',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            conversationId: {
                type: DataTypes.INTEGER
            },
            memberId: {
                type: DataTypes.INTEGER
            },
            content: {
                type: DataTypes.STRING
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
            // isSeen: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: false,
            // },
        },
        {
            tableName: 'conversation_message',
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.Conversation, {
            foreignKey: 'conversationId'
        });

        Model.belongsTo(models.ConversationMember, {
            foreignKey: 'memberId',
            as: 'member'
        });

        Model.hasMany(models.ConversationReadMessage, {
            foreignKey: 'messageId',
            as: 'read_by'
        });
    };

    return Model;
};
