const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'ConversationReadMessage',
        {
            messageId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true
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
            tableName: 'conversation_read_message'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.ConversationMessage, {
            foreignKey: 'messageId',
            as: 'message'
        });
    };

    return Model;
};
