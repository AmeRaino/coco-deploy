module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserAppointmentSetting',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            day_of_week: DataTypes.STRING,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING,
            connection_method: DataTypes.STRING,
            connection_link: DataTypes.STRING
        },
        {
            tableName: 'user_appointment_setting'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
