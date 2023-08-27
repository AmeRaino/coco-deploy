module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserDeviceToken',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            fcm_token: DataTypes.STRING,
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            frequency_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            expire: {
                type: DataTypes.DATEONLY,
                allowNull: false
            }
        },
        {
            tableName: 'user_device_token',
            timestamps: true,
            createdAt: false,
            updatedAt: true
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Model.belongsTo(models.Frequency, { foreignKey: 'frequency_id', as: 'frequency' });
    };
    return Model;
};
