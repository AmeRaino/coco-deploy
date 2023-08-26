module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserAppointment',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            with_mentor_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            date: DataTypes.DATE,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING,
            connection_method: DataTypes.STRING,
            connection_link: DataTypes.STRING,
            message: DataTypes.STRING,
            create_by_mentee_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'user_appointment'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'create_by_mentee_id', as: 'create_by_mentee' });
        Model.belongsTo(models.User, { foreignKey: 'with_mentor_id', as: 'with_mentor' });
    };
    return Model;
};
