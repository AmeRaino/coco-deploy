module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Frequency',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            describe: DataTypes.STRING
        },
        {
            tableName: 'frequency'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.UserDeviceToken, { foreignKey: 'frequency_id', as: 'frequency' });
    };
    return Model;
};
