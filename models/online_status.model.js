const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'OnlineStatus',
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            isOnline: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            lastOnlineAt: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW
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
            tableName: 'online_status'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Model;
};
